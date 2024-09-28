import React, { useState, useEffect } from 'react';
import { IoCloudUploadSharp } from "react-icons/io5";
import { FaMicrophoneAlt } from "react-icons/fa";
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

// Constants for commands
const NEXT_COMMAND = "next";
const START_YOUR_ANSWER = "START YOUR ANSWER";
const END_MARKER = "END";
const EXAM_COMPLETED_MESSAGE = "Exam Completed";

const StartExam = () => {
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
    const [currentAnswer, setCurrentAnswer] = useState(""); // Store the current answer

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
        // recognition.interimResults = false;
        recognition.interimResults = true;

        recognition.maxAlternatives = 1;

        let answerBuffer = ""; // Buffer to store the full answer
        recognition.onresult = (event) => {
            let finalTranscript = ''; // For final results only

            // Loop through results and only store the final transcript
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript.trim();

                if (event.results[i].isFinal) {
                    // If it's a final result, store the final transcript
                    finalTranscript += ` ${transcript}`;
                }
            }

            // Only update the state once the final result is obtained
            if (finalTranscript) {
                answerBuffer = finalTranscript.trim();
                console.log("Final Answer buffer updated: ", answerBuffer); // Debugging line
                // Update the recognized answers state with only the final answer and increment the question number
                setRecognizedAnswers((prevState) => ({
                    ...prevState,
                    answers: `${prevState.answers}\nAnswer ${prevState.currentQuestionNumber}: ${answerBuffer}`, // Append new answer
                    currentQuestionNumber: prevState.currentQuestionNumber + 1, // Increment question number
                }));

                // Increment question number for the next answer
                setCurrentAnswer(''); // Clear current answer buffer for next question
            }
        };




        recognition.onend = () => {
            console.log("Recognition ended. isReadyToRecord:", isReadyToRecord); // Debugging line
            if (isReadyToRecord) {
                // Restart recognition automatically if still ready to record
                recognition.start();
                console.log("Recognition restarted automatically."); // Debugging line
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error); // Debugging line
        };

        console.log("Starting recognition..."); // Debugging line
        recognition.start(); // Start listening immediately
        setRecognitionInstance(recognition);
        setIsRecordingEnabled(true); // Recording is enabled
    };

    // Logic for reading the next question
    const readNextQuestion = (text, position) => {
        const nextEnd = text.indexOf(END_MARKER, position);

        // Handle end of exam case
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

            // Disable recording while system is speaking
            setIsReadyToRecord(false); // Prevent recording during question reading
            console.log("Reading question: ", nextQuestion); // Debugging line

            utterance.onend = () => {
                console.log("System finished reading question. Prompting to start answer."); // Debugging line
                // Prompt the user to start answering
                const startAnswerPrompt = new SpeechSynthesisUtterance(START_YOUR_ANSWER);
                startAnswerPrompt.onend = () => {
                    console.log("'START YOUR ANSWER' command finished. Ready to record now."); // Debugging line
                    setIsReadyToRecord(true); // Ready to record after prompt
                    startRecordingAnswer(); // Restart recording
                };
                window.speechSynthesis.speak(startAnswerPrompt);
            };

            window.speechSynthesis.speak(utterance);
            setCurrentTextPosition(nextEnd + END_MARKER.length); // Update position for the next question
        }
    };

    const stopRecording = () => {
        if (recognitionInstance) {
            recognitionInstance.stop(); // Stop the current recognition instance
            setIsRecordingEnabled(false); // Disable recording state
            console.log("Recording stopped."); // Debugging line
        }
    };

    // Manually move to the next question (in case there's a "Next" button)
    const nextQuestion = () => {
        stopRecording(); // Stop recording for the current question
        readNextQuestion(extractedText, currentTextPosition); // Move to next question
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
        <section className="startExamSec" id='startExamSec' style={{ paddingTop: '100px' }}>
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

export default StartExam;
