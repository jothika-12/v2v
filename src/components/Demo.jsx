import React, { useState, useEffect } from 'react';
import { IoCloudUploadSharp } from "react-icons/io5";
import { FaMicrophoneAlt } from "react-icons/fa";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const NEXT_COMMAND = "next";
const START_YOUR_ANSWER = "START YOUR ANSWER";
const END_MARKER = "END";
const EXAM_COMPLETED_MESSAGE = "Exam Completed";

const Demo = () => {
    const [extractedText, setExtractedText] = useState('');
    const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);
    const [recognizedAnswers, setRecognizedAnswers] = useState({
        answers: '',
        currentQuestionNumber: 1
    });
    const [currentTextPosition, setCurrentTextPosition] = useState(0);
    const [isExamCompleted, setIsExamCompleted] = useState(false);
    const [recognitionInstance, setRecognitionInstance] = useState(null);
    const [isReadyToRecord, setIsReadyToRecord] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState("");

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


    const startRecordingAnswer = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true; // Keep capturing interim results
        recognition.maxAlternatives = 1;

        let answerBuffer = ""; // Buffer to store the entire answer
        recognition.onresult = (event) => {
            let interimTranscript = ""; // For interim results

            // Loop through results and capture all interim results
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript.trim();

                if (event.results[i].isFinal) {
                    answerBuffer += ` ${transcript}`; // Append final results to answer buffer
                } else {
                    interimTranscript += ` ${transcript}`; // Capture interim results for live feedback (optional)
                }

                // If user says 'NEXT', stop recording and save the answer
                if (transcript.toLowerCase().includes(NEXT_COMMAND)) {
                    stopRecording(); // Stop the recognition
                    answerBuffer = answerBuffer.trim(); // Clean up the final answer buffer

                    // Append the current answer to the answers list and move to the next question
                    setRecognizedAnswers((prevState) => ({
                        ...prevState,
                        answers: `${prevState.answers}\nAnswer ${prevState.currentQuestionNumber}: ${answerBuffer}`,
                        currentQuestionNumber: prevState.currentQuestionNumber + 1,
                    }));
                    setCurrentAnswer(''); // Reset the answer buffer for the next question
                    return; // Exit to avoid processing 'NEXT' as part of the answer
                }
            }

            console.log("Interim Transcript: ", interimTranscript); // Optional: for debugging interim results
        };

        recognition.onend = () => {
            // Automatically restart recognition if still ready to record
            if (isReadyToRecord) {
                recognition.start();
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error);
        };

        recognition.start(); // Start the recognition
        setRecognitionInstance(recognition);
        setIsRecordingEnabled(true); // Set recording as enabled
    };



    const readNextQuestion = (text, position) => {
        const nextEnd = text.indexOf(END_MARKER, position);

        if (nextEnd === -1 || position >= text.length) {
            const utterance = new SpeechSynthesisUtterance(EXAM_COMPLETED_MESSAGE);
            utterance.onend = () => {
                setIsRecordingEnabled(false); // Stop recording when exam ends
                setIsExamCompleted(true);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            const nextQuestion = text.substring(position, nextEnd);
            const utterance = new SpeechSynthesisUtterance(nextQuestion);

            setIsReadyToRecord(false);
            console.log("Reading question: ", nextQuestion);

            utterance.onend = () => {
                console.log("System finished reading question. Prompting to start answer.");
                const startAnswerPrompt = new SpeechSynthesisUtterance(START_YOUR_ANSWER);
                startAnswerPrompt.onend = () => {
                    console.log("'START YOUR ANSWER' command finished. Ready to record now.");
                    setIsReadyToRecord(true);
                    startRecordingAnswer();
                };
                window.speechSynthesis.speak(startAnswerPrompt);
            };

            window.speechSynthesis.speak(utterance);
            setCurrentTextPosition(nextEnd + END_MARKER.length);
        }
    };

    const stopRecording = () => {
        if (recognitionInstance) {
            recognitionInstance.stop(); // Stop recognition
            setIsRecordingEnabled(false); // Set recording state to false
            console.log("Recording stopped.");
        }
    };


    const nextQuestion = () => {
        stopRecording();
        readNextQuestion(extractedText, currentTextPosition);
    };



    useEffect(() => {
        if (extractedText && currentTextPosition === 0) {
            readNextQuestion(extractedText, currentTextPosition);
        }
    }, [extractedText]);

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleDeleteText = () => {
        setExtractedText('');
        window.speechSynthesis.cancel();
        setIsRecordingEnabled(false);
        setCurrentTextPosition(0);
        setIsExamCompleted(false);
    };




    const downloadAnswers = () => {
        const doc = new jsPDF();
        doc.text(recognizedAnswers.answers, 10, 10);
        doc.save("answers.pdf");
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
                                <p>Start Answering</p>
                            </div>
                            <div className="examContents">
                                <p>Press the button below to answer the question.</p>
                            </div>
                            <div className="btnContainer">
                                {/* {isRecordingEnabled ? (
                                    <button className="customUploadBtn" disabled>
                                        Recording...
                                    </button>
                                ) : ( */}
                                <button
                                    className="customUploadBtn"
                                    onClick={nextQuestion}
                                    disabled={!extractedText || isExamCompleted}
                                >
                                    Next Question
                                </button>
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <div className="ExamDetailsCards regCont white">
                            <div className="regcogTxt mb-2">
                                <p className="mb-0 text-center">Recognized Answers</p>
                            </div>
                            <div className="examContents recogContent">
                                {/* Real-time update of recognized answers */}
                                <p>{recognizedAnswers.answers || 'No answers recorded yet.'}</p>
                            </div>
                            {recognizedAnswers.answers && (
                                <div className="btnContainer">
                                    <button className="btnUploads printBtn" onClick={printAnswers}>
                                        Print Answers
                                    </button>
                                    <button className="btnUploads downloadBtn" onClick={downloadAnswers}>
                                        Download as PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Demo;
