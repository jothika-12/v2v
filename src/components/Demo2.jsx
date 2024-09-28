import React, { useState, useEffect } from 'react';
import { IoCloudUploadSharp } from "react-icons/io5";
import { FaMicrophoneAlt } from "react-icons/fa";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const Demo2 = () => {

    const [extractedText, setExtractedText] = useState('');
    const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
    const [recognizedAnswers, setRecognizedAnswers] = useState({
        answers: '',
        currentQuestionNumber: 1
    });
    const [currentTextPosition, setCurrentTextPosition] = useState(0);
    const [isExamCompleted, setIsExamCompleted] = useState(false);
    const [recognitionInstance, setRecognitionInstance] = useState(null);

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
            const utterance = new SpeechSynthesisUtterance("Exam Completed");
            utterance.onend = () => {
                setIsRecordingEnabled(false);
                setIsExamCompleted(true);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            const nextQuestion = text.substring(position, nextEnd);
            const utterance = new SpeechSynthesisUtterance(nextQuestion);

            utterance.onend = () => {
                const startAnswerPrompt = new SpeechSynthesisUtterance("START YOUR ANSWER");

                startAnswerPrompt.onend = () => {
                    // Start recording automatically after the "START YOUR ANSWER" prompt
                    setIsRecordingEnabled(true);
                    startRecordingAnswer();  // Automatically trigger recording
                };

                window.speechSynthesis.speak(startAnswerPrompt);
            };

            window.speechSynthesis.speak(utterance);
            setCurrentTextPosition(nextEnd + 3);
        }
    };


    useEffect(() => {
        if (extractedText && currentTextPosition === 0) {
            readNextQuestion(extractedText, currentTextPosition);
        }
    }, [extractedText]);

    const handleDeleteText = () => {
        setExtractedText('');
        window.speechSynthesis.cancel();
        setIsRecordingEnabled(false);
        setCurrentTextPosition(0);
        setIsExamCompleted(false);
    };

    const downloadAnswers = () => {
        const doc = new jsPDF();

        // Set the title of the PDF document
        doc.setFontSize(16);
        doc.text('Recognized Answers', 10, 10);

        // Add the recognized answers to the PDF
        doc.setFontSize(12);
        doc.text(recognizedAnswers.answers || 'No answers recorded yet.', 10, 20);

        // Save the generated PDF with a specific name
        doc.save('recognized_answers.pdf');
    };

    const startRecordingAnswer = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech Recognition API is not supported in this browser. Please use Google Chrome.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Error handling
        recognition.onerror = (event) => {
            console.error('Speech recognition error detected: ' + event.error);
            alert('An error occurred during speech recognition: ' + event.error);
        };

        // When a result is detected
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log('Transcript:', transcript);

            // Handling "Next Question" command
            if (transcript.includes('next question')) {
                console.log('Next Question command detected');
                recognition.stop(); // Stop the current recognition instance
                // Proceed to the next question
                readNextQuestion(extractedText, currentTextPosition);
            } else if (transcript.includes('stop')) {
                console.log('Stop command detected');
                recognition.stop(); // Stop listening if "stop" is said
                setIsRecordingEnabled(false);
            } else {
                // Handle normal answers and append them
                setRecognizedAnswers(prevState => ({
                    ...prevState,
                    answers: `${prevState.answers}\nQuestion Number ${prevState.currentQuestionNumber}: ${transcript}`,
                    currentQuestionNumber: prevState.currentQuestionNumber + 1
                }));
            }
        };

        // When speech recognition ends, restart it if needed
        recognition.onend = () => {
            console.log('Speech recognition ended');
            if (!isExamCompleted && isRecordingEnabled) {
                console.log('Restarting speech recognition');
                recognition.start(); // Restart recognition to keep listening for more commands
            }
        };

        recognition.start(); // Start speech recognition
        setRecognitionInstance(recognition);
        setIsRecordingEnabled(true); // Reflect the UI state
    };

    const stopRecording = () => {
        if (recognitionInstance) {
            recognitionInstance.stop(); // Stop the active recognition instance
            setIsRecordingEnabled(false); // Update the state to stop recording
        }
    };


    const nextQuestion = () => {
        stopRecording();
        readNextQuestion(extractedText, currentTextPosition);
    };




    const printAnswers = () => {
        const answerWindow = window.open("", "", "width=600,height=400");
        answerWindow.document.write("<pre>" + recognizedAnswers.answers + "</pre>");
        answerWindow.document.close();
        answerWindow.print();
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
                                    Upload Question Paper
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
                                    disabled={isRecordingEnabled || isExamCompleted}
                                    onClick={startRecordingAnswer}
                                >
                                    Start Recording
                                </button>
                                <button
                                    className="btnUploads"
                                    disabled={!isRecordingEnabled || isExamCompleted}
                                    onClick={stopRecording}
                                >
                                    Stop Recording
                                </button>
                                <button
                                    className="btnUploads"
                                    disabled={isExamCompleted}
                                    onClick={nextQuestion}
                                >
                                    Next Question
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-6">
                        <div className="ExamDetailsCards regCont white">
                            <div className="regcogTxt mb-2">
                                <p className="mb-0 text-center">Recognized Answers</p>
                            </div>
                            <div className="examContents recogContent">
                                <pre>{recognizedAnswers.answers || 'No answers recorded yet.'}</pre>
                            </div>
                            <div className="btnContainer">
                                <button
                                    className="btnUploads"
                                    onClick={downloadAnswers} // Download as PDF
                                >
                                    Download Answers as PDF
                                </button>
                                <button
                                    className="btnUploads"
                                    onClick={printAnswers} // Print the answers
                                >
                                    Print Answers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Demo2;



