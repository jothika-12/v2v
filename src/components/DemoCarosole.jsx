import React, { useState, useEffect } from 'react';
import { IoCloudUploadSharp } from "react-icons/io5";
import { FaMicrophoneAlt } from "react-icons/fa";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const DemoCarosole = () => {
    const [extractedText, setExtractedText] = useState('');
    const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
    const [recognizedAnswers, setRecognizedAnswers] = useState({
        answers: '',
        currentQuestionNumber: 1
    });
    const [currentTextPosition, setCurrentTextPosition] = useState(0); // Track the reading position
    const [isExamCompleted, setIsExamCompleted] = useState(false); // Track exam completion

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType.includes('image')) {
                extractTextFromImage(file);
            } else if (fileType.includes('pdf')) {
                extractTextFromPDF(file);
            } else {
                alert("Please upload a valid image or PDF file.");
            }
        }
    };

    const extractTextFromImage = (file) => {
        Tesseract.recognize(file, 'eng', { logger: (m) => console.log(m) })
            .then(({ data: { text } }) => setExtractedText(text))
            .catch((err) => console.error("Error extracting text from image: ", err));
    };

    const extractTextFromPDF = async (file) => {
        const reader = new FileReader();
        reader.onload = async function () {
            const typedArray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let pdfText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                pdfText += pageText + '\n';
            }

            setExtractedText(pdfText);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const readNextQuestion = (text, position) => {
        const nextEnd = text.indexOf('END', position);
        if (nextEnd === -1 || position >= text.length) {
            // No more questions, exam is completed
            const utterance = new SpeechSynthesisUtterance("Exam Completed");
            utterance.onend = () => {
                setIsRecordingEnabled(false); // Disable recording
                setIsExamCompleted(true); // Mark the exam as completed
            };
            window.speechSynthesis.speak(utterance);
        } else {
            // Extract and read the next question
            const nextQuestion = text.substring(position, nextEnd);
            const utterance = new SpeechSynthesisUtterance(nextQuestion);

            utterance.onend = () => {
                setIsRecordingEnabled(true); // Enable recording after the question is read
            };

            window.speechSynthesis.speak(utterance);
            setCurrentTextPosition(nextEnd + 3); // Move to the next position after "END"
        }
    };

    useEffect(() => {
        if (extractedText && currentTextPosition === 0) {
            // Start reading the first question if text is available
            readNextQuestion(extractedText, currentTextPosition);
        }
    }, [extractedText]);

    const handleDeleteText = () => {
        setExtractedText('');
        window.speechSynthesis.cancel();
        setIsRecordingEnabled(false);
        setCurrentTextPosition(0); // Reset text position
        setIsExamCompleted(false); // Reset exam status
    };

    const startRecordingAnswer = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            if (transcript.toLowerCase().includes('stop')) {
                recognition.stop(); // Stop recording when "STOP" is heard
                setIsRecordingEnabled(false);
                // Automatically read the next question
                readNextQuestion(extractedText, currentTextPosition);
            } else {
                // Append the user's answer
                setRecognizedAnswers(prevState => ({
                    ...prevState,
                    answers: `${prevState.answers}\nQuestion Number ${prevState.currentQuestionNumber}: ${transcript}`,
                    currentQuestionNumber: prevState.currentQuestionNumber + 1
                }));
            }
        };

        recognition.onend = () => {
            if (!isExamCompleted) {
                recognition.start(); // Continue listening if the exam is not completed
            }
        };

        recognition.start();
    };

    const startAutomaticRecording = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            if (transcript.toLowerCase().includes('arambikalama')) {
                startRecordingAnswer();
            }
        };

        recognition.start();
    };

    return (
        <section className="startExamSec">
            <div className="container">
                <div className="row g-4 d-flex justify-content-center">
                    <h2 className='text-center mb-4'>Start Your Exam</h2>

                    <div className="col-xl-4 col-md-6 col-lg-6">
                        <div className="ExamDetailsCards purple">
                            <div className="examDetIcons mb-2">
                                <IoCloudUploadSharp />
                            </div>
                            <div className="examDetailsTitle">
                                <p>Upload Question Paper</p>
                            </div>
                            <div className="examContents">
                                <p>Please upload the question paper in PDF or image format (JPG, PNG). The maximum file size allowed is 5MB.</p>
                            </div>
                            <div className="btnContainer">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileUpload}
                                    className="fileInput"
                                    id="fileInput"
                                />
                                <button className="customUploadBtn" onClick={handleButtonClick}>
                                    Upload File
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-6">
                        <div className="ExamDetailsCards regCont white">
                            <div className="regcogTxt mb-2">
                                <p className="mb-0 text-center">Recognized Question</p>
                            </div>
                            <div className="examContents recogContent">
                                <p>{extractedText || 'No text recognized yet.'}</p>
                            </div>
                            <div className="btnContainer">
                                {extractedText && (
                                    <button
                                        className="btnUploads deleteRegBtn"
                                        onClick={handleDeleteText}
                                    >
                                        Delete Recognized Text
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-md-6 col-lg-6">
                        <div className="ExamDetailsCards purple">
                            <div className="examDetIcons mb-2">
                                <FaMicrophoneAlt />
                            </div>
                            <div className="examDetailsTitle">
                                <p>Record Your Answer</p>
                            </div>
                            <div className="examContents">
                                <p>Click the "Start Recording" button to record your answer. Ensure your microphone is on and working.</p>
                            </div>
                            <div className="btnContainer">
                                <button
                                    className="btnUploads"
                                    disabled={!isRecordingEnabled || isExamCompleted}
                                    onClick={startRecordingAnswer}
                                >
                                    Start Recording
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-6">
                        <div className="ExamDetailsCards regCont white">
                            <div className="regcogTxt mb-2">
                                <p className="mb-0 text-center">Recognized Answer</p>
                            </div>
                            <div className="examContents recogContent printSectionCont">
                                <p dangerouslySetInnerHTML={{ __html: recognizedAnswers.answers.replace(/\n/g, '<br/>') }} />
                            </div>
                            <div className="printBtnCont">
                                <button className="printAnsBtn">Print the Answer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DemoCarosole;
