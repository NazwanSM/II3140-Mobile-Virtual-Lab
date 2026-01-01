import { getModuleById } from '@/lib/actions/modules';
import { getQuizQuestions, getQuizResults, submitQuiz } from '@/lib/actions/quiz';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Question {
    id: string;
    question_number: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation: string;
}

interface PreviousResult {
    correct_answers: number;
    wrong_answers: number;
    total_questions: number;
    score: number;
}

export default function QuizScreen() {
    const router = useRouter();
    const { moduleId, difficulty } = useLocalSearchParams<{ moduleId: string; difficulty: string }>();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [module, setModule] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
    
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState('');
    
    const [showResult, setShowResult] = useState(false);
    const [quizResult, setQuizResult] = useState<{
        score: number;
        correctAnswers: number;
        wrongAnswers: number;
        tintaEarned: number;
    } | null>(null);

    const difficultyLabel = difficulty 
        ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        : '';

    const getDifficultyColors = () => {
        switch(difficulty) {
            case 'mudah':
                return { bg: 'bg-green-500', border: 'border-green-600' };
            case 'sedang':
                return { bg: 'bg-yellow-500', border: 'border-yellow-600' };
            case 'sulit':
                return { bg: 'bg-red-500', border: 'border-red-600' };
            default:
                return { bg: 'bg-gray-500', border: 'border-gray-600' };
        }
    };

    const colors = getDifficultyColors();

    const fetchData = useCallback(async () => {
        if (!moduleId || !difficulty) return;
        
        try {
            setLoading(true);
            const [moduleData, questionsData, quizResultsData] = await Promise.all([
                getModuleById(moduleId),
                getQuizQuestions(moduleId, difficulty),
                getQuizResults(moduleId)
            ]);
            
            if (moduleData) {
                setModule(moduleData);
            }
            
            if (questionsData) {
                setQuestions(questionsData);
            }
            
            if (quizResultsData && Array.isArray(quizResultsData)) {
                const prevResult = quizResultsData.find((r: any) => r.difficulty === difficulty);
                if (prevResult) {
                    setPreviousResult({
                        correct_answers: prevResult.correct_answers,
                        wrong_answers: prevResult.wrong_answers,
                        total_questions: prevResult.total_questions,
                        score: prevResult.score,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            Alert.alert('Error', 'Gagal memuat soal latihan');
        } finally {
            setLoading(false);
        }
    }, [moduleId, difficulty]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        const currentQ = questions[questionIndex];
        const isCorrect = answer === currentQ.correct_answer;
        
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: answer
        }));

        setIsCorrectAnswer(isCorrect);
        setCurrentExplanation(currentQ.explanation || '');
        setShowFeedback(true);
    };

    const handleContinue = () => {
        setShowFeedback(false);
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleSubmit = async () => {
        if (!moduleId || !difficulty) return;
        
        const unanswered = questions.filter((_, idx) => !answers[idx]);
        if (unanswered.length > 0) {
            Alert.alert(
                'Peringatan',
                `Masih ada ${unanswered.length} soal yang belum dijawab. Yakin ingin submit?`,
                [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Submit', onPress: submitQuizAnswers }
                ]
            );
            return;
        }
        
        submitQuizAnswers();
    };

    const submitQuizAnswers = async () => {
        if (!moduleId || !difficulty) return;
        
        try {
            setSubmitting(true);
            const result = await submitQuiz(moduleId, difficulty, answers, questions);
            
            if (result.success) {
                setQuizResult({
                    score: result.score,
                    correctAnswers: result.correctAnswers,
                    wrongAnswers: result.wrongAnswers,
                    tintaEarned: result.tintaEarned || 0,
                });
                setShowResult(true);
            } else {
                Alert.alert('Error', result.error || 'Gagal menyimpan hasil');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            Alert.alert('Error', 'Gagal menyimpan hasil latihan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinish = () => {
        setShowResult(false);
        router.back();
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#F9C74E" />
                <Text className="mt-4 font-satoshi-medium text-gray-600">Memuat soal...</Text>
            </View>
        );
    }

    if (showIntro) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />

                <View className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <View className="pt-16 px-6 pb-4">
                        <View className="flex-row items-center justify-between">
                            <Pressable 
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Text className="flex-1 text-center text-base font-satoshi-bold text-gray-900 mx-4" numberOfLines={2}>
                                {module?.title}
                            </Text>

                            <View className="w-10 h-10" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                        <View className="flex-1 px-6 pt-8">
                            <View className="items-center gap-4">
                                <View className="w-72 bg-foundation-yellow-light border-2 border-black rounded-2xl py-4 px-6">
                                    <Text className="text-center font-satoshi-medium text-gray-900">
                                        Tipe Soal : <Text className="font-satoshi-bold">{difficultyLabel}</Text>
                                    </Text>
                                </View>

                                <View className="w-72 bg-foundation-yellow-light border-2 border-black rounded-2xl py-4 px-6">
                                    <Text className="text-center font-satoshi-medium text-gray-900">
                                        Jumlah Soal : <Text className="font-satoshi-bold">{questions.length} Soal</Text>
                                    </Text>
                                </View>

                                <View className="w-72 bg-[#C7DDFB] border-2 border-black rounded-2xl py-4 px-6">
                                    <Text className="text-center font-satoshi-medium text-gray-900">
                                        Benar : <Text className="font-satoshi-bold">{previousResult?.correct_answers ?? 0} Soal</Text>
                                    </Text>
                                </View>

                                <View className="w-72 bg-[#F9C9C9] border-2 border-black rounded-2xl py-4 px-6">
                                    <Text className="text-center font-satoshi-medium text-gray-900">
                                        Salah : <Text className="font-satoshi-bold">{previousResult?.wrong_answers ?? 0} Soal</Text>
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-12 px-6">
                                <Pressable
                                    onPress={() => setShowIntro(false)}
                                    className="bg-foundation-blue-normal py-4 rounded-full border-2 border-black"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                >
                                    <Text className="text-center font-satoshi-bold text-white text-lg">
                                        Kerjakan
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </>
        );
    }

    const currentQ = questions[currentQuestion];

    const correctCount = Object.entries(answers).filter(([idx, ans]) => {
        const q = questions[parseInt(idx)];
        return q && ans === q.correct_answer;
    }).length;
    const wrongCount = Object.keys(answers).length - correctCount;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            
            <View className="flex-1 bg-white">
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <View className="pt-16 px-6 pb-4">
                        <View className="flex-row items-center justify-between">
                            <Pressable 
                                onPress={() => {
                                    Alert.alert(
                                        'Keluar',
                                        'Yakin ingin keluar? Progress akan hilang.',
                                        [
                                            { text: 'Batal', style: 'cancel' },
                                            { text: 'Keluar', onPress: () => router.back(), style: 'destructive' }
                                        ]
                                    );
                                }}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>

                            <Text className="flex-1 text-center text-base font-satoshi-bold text-gray-900 mx-4" numberOfLines={2}>
                                {module?.title || 'Latihan'}
                            </Text>

                            <View className="w-10 h-10" />
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-200 mx-6" />

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="mx-6 mt-4 flex-row items-center bg-white rounded-2xl border-2 border-gray-800 p-3">
                            <View className="w-12 h-12 rounded-2xl bg-foundation-blue-normal items-center justify-center">
                                <Text className="text-white font-satoshi-bold text-lg">
                                    {currentQ.question_number}
                                </Text>
                            </View>

                            <View className={`ml-3 px-4 py-2 rounded-xl ${
                                difficulty === 'mudah' ? 'bg-[#64B075]' :
                                difficulty === 'sedang' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                                <Text className="text-white font-satoshi-medium text-sm">
                                    Tipe Soal : {difficultyLabel}
                                </Text>
                            </View>

                            <View className="flex-row items-center ml-auto gap-3">
                                <View className="flex-row items-center">
                                    <Ionicons name="checkmark" size={20} color="#22C55E" />
                                    <Text className="font-satoshi-bold text-gray-800 ml-1">{correctCount}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="close" size={20} color="#EF4444" />
                                    <Text className="font-satoshi-bold text-gray-800 ml-1">{wrongCount}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="mx-6 mt-4">
                            <Text className="text-lg font-satoshi-bold text-gray-900 mb-2">
                                Soal
                            </Text>

                            <Text className="text-base font-satoshi-medium text-gray-800 mb-6 leading-6">
                                {currentQ.question_text}
                            </Text>

                            <View className="gap-3">
                                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                                    const optionKey = `option_${letter.toLowerCase()}` as keyof Question;
                                    const optionText = currentQ[optionKey] as string;
                                    const isSelected = answers[currentQuestion] === letter;
                                    
                                    return (
                                        <Pressable
                                            key={letter}
                                            onPress={() => handleAnswerSelect(currentQuestion, letter)}
                                            disabled={!!answers[currentQuestion]}
                                            className={`p-4 rounded-2xl border-2 flex-row items-center ${
                                                isSelected 
                                                    ? 'bg-blue-500 border-black' 
                                                    : 'bg-foundation-yellow-light border-black'
                                            }`}
                                            style={({ pressed }) => [{ opacity: pressed && !answers[currentQuestion] ? 0.8 : 1 }]}
                                        >
                                            <View className={`w-10 h-10 rounded-xl border-2 items-center justify-center mr-4 ${
                                                isSelected 
                                                    ? 'bg-white border-white' 
                                                    : 'bg-white border-black'
                                            }`}>
                                                <Text className={`font-satoshi-bold text-lg ${
                                                    isSelected ? 'text-blue-500' : 'text-gray-800'
                                                }`}>
                                                    {letter}
                                                </Text>
                                            </View>
                                            <Text className={`flex-1 font-satoshi-medium ${
                                                isSelected ? 'text-white' : 'text-gray-800'
                                            }`}>
                                                {optionText}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mx-6 mt-6 bg-white rounded-2xl p-4 border-2 border-gray-800">
                            <Text className="font-satoshi-bold text-gray-900 mb-4">
                                Nomor Soal
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {questions.map((q, idx) => {
                                    const isAnswered = !!answers[idx];
                                    const isCorrect = isAnswered && answers[idx] === q.correct_answer;
                                    const isWrong = isAnswered && answers[idx] !== q.correct_answer;
                                    
                                    return (
                                        <Pressable
                                            key={q.id}
                                            onPress={() => setCurrentQuestion(idx)}
                                            className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
                                                currentQuestion === idx
                                                    ? 'bg-blue-500 border-black'
                                                    : isCorrect
                                                    ? 'bg-green-100 border-green-500'
                                                    : isWrong
                                                    ? 'bg-red-100 border-red-500'
                                                    : 'bg-white border-black'
                                            }`}
                                        >
                                            <Text className={`font-satoshi-bold text-lg ${
                                                currentQuestion === idx
                                                    ? 'text-white'
                                                    : isCorrect
                                                    ? 'text-green-600'
                                                    : isWrong
                                                    ? 'text-red-600'
                                                    : 'text-gray-800'
                                            }`}>
                                                {q.question_number}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="flex-row gap-3 mx-6 mt-6 mb-8">
                            <Pressable
                                onPress={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className={`flex-1 py-4 rounded-full border-2 ${
                                    currentQuestion === 0 
                                        ? 'border-gray-300 bg-gray-100' 
                                        : 'border-foundation-blue-normal bg-white'
                                }`}
                                style={({ pressed }) => [{ opacity: pressed && currentQuestion > 0 ? 0.8 : 1 }]}
                            >
                                <Text className={`text-center font-satoshi-bold ${
                                    currentQuestion === 0 ? 'text-gray-400' : 'text-foundation-blue-normal'
                                }`}>
                                    Sebelumnya
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    if (currentQuestion === questions.length - 1) {
                                        handleSubmit();
                                    } else {
                                        setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1));
                                    }
                                }}
                                disabled={submitting}
                                className="flex-1 py-4 rounded-full bg-foundation-blue-normal"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                {submitting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text className="text-center font-satoshi-bold text-white">
                                        {currentQuestion === questions.length - 1 ? 'Submit' : 'Selanjutnya'}
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>

            <Modal
                visible={showFeedback}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <View className="flex-1 bg-black/50 items-center justify-center px-6">
                    <View className="w-full max-w-sm bg-white rounded-2xl overflow-hidden border-2 border-black mb-2">
                        <View className={`py-3 ${isCorrectAnswer ? 'bg-[#64B075]' : 'bg-foundation-red-normal'}`}>
                            <Text className="text-xl font-satoshi-bold text-white text-center">
                                {isCorrectAnswer ? 'JAWABAN BENAR !' : 'JAWABAN SALAH !'}
                            </Text>
                        </View>
                    </View>                 
                    <View className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border-2 border-black">
                        <View className="p-6 items-center">
                            <View className="w-40 h-40 items-center justify-center mb-4">
                                <Image 
                                    source={isCorrectAnswer 
                                        ? require('../../../assets/images/Feedback-Correct.png')
                                        : require('../../../assets/images/Feedback-Wrong.png')
                                    }
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-sm font-satoshi-medium text-black text-center mb-6">
                                {isCorrectAnswer 
                                    ? 'Jawaban kamu Benar! Lanjutkan soal berikutnya' 
                                    : 'Jawaban kamu salah, coba lagi ingat materinya !'}
                            </Text>

                            <Pressable
                                onPress={handleContinue}
                                className={`${isCorrectAnswer ? 'bg-[#64B075]' : 'bg-foundation-red-normal'} px-12 py-1 rounded-2xl border-2 border-gray-800`}
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <Text className="text-center font-satoshi-bold text-white text-base">
                                    Lanjutkan
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showResult}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <View className="flex-1 bg-black/50 items-center justify-center px-6">
                    <View className="bg-white w-full max-w-sm rounded-3xl p-6">
                        <View className="items-center mb-4">
                            <View className={`w-20 h-20 rounded-full items-center justify-center ${
                                (quizResult?.score || 0) >= 60 ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                <Text className={`text-2xl font-satoshi-bold ${
                                    (quizResult?.score || 0) >= 60 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {quizResult?.score}%
                                </Text>
                            </View>
                        </View>

                        <Text className="text-xl font-satoshi-bold text-gray-900 text-center mb-4">
                            {(quizResult?.score || 0) >= 60 ? 'Selamat!' : 'Coba Lagi!'}
                        </Text>

                        <View className="bg-gray-50 rounded-xl p-4 mb-4">
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-satoshi-medium text-gray-600">Jawaban Benar</Text>
                                <Text className="font-satoshi-bold text-green-500">{quizResult?.correctAnswers}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-satoshi-medium text-gray-600">Jawaban Salah</Text>
                                <Text className="font-satoshi-bold text-red-500">{quizResult?.wrongAnswers}</Text>
                            </View>
                            <View className="h-px bg-gray-200 my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-satoshi-medium text-gray-600">Tinta Diperoleh</Text>
                                <Text className="font-satoshi-bold text-yellow-500">+{quizResult?.tintaEarned?.toLocaleString('id-ID')}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handleFinish}
                            className="bg-foundation-yellow-normal py-3.5 rounded-xl"
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        >
                            <Text className="text-center font-satoshi-bold text-white">
                                Selesai
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
}
