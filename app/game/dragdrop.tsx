import { updateGameProgress } from '@/lib/actions/progress';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const allGameData = [
    {
        paragraph: "Ketika saya akan memasuki ruang ujian ini, saya merasa {0} tidak akan dapat mengikuti ujian dengan tenang. Akan tetapi, setelah saya berdoa, perasaan itu menjadi berkurang. Ternyata saya {1} ketakutan. Begitu lembar soal saya buka, saya menarik {2} panjang dan mengucapkan nama Tuhan, perasaan saya semakin tenang sehingga dapat menjawab soal dengan baik.",
        blanks: [
            { id: 0, correctAnswer: "khawatir" },
            { id: 1, correctAnswer: "hanya" },
            { id: 2, correctAnswer: "napas" }
        ],
        options: [
            { id: "opt1", text: "kawatir" },
            { id: "opt2", text: "kuatir" },
            { id: "opt3", text: "khawatir" },
            { id: "opt4", text: "khuwatir" },
            { id: "opt5", text: "hanya" },
            { id: "opt6", text: "cuma" },
            { id: "opt7", text: "nafas" },
            { id: "opt8", text: "napas" }
        ]
    },
    {
        paragraph: "Banyak perusahaan kini menuntut karyawan yang memiliki {0} tinggi agar mampu bersaing. Namun, apabila seseorang hanya memiliki ijazah tanpa {1} praktis, maka peluang naik jabatan menjadi {2}.",
        blanks: [
            { id: 0, correctAnswer: "kualifikasi" },
            { id: 1, correctAnswer: "kompetensi" },
            { id: 2, correctAnswer: "kecil" }
        ],
        options: [
            { id: "opt1", text: "kualifikasi" },
            { id: "opt2", text: "kwalifikasi" },
            { id: "opt3", text: "kompetensi" },
            { id: "opt4", text: "kompentensi" },
            { id: "opt5", text: "lebih besar" },
            { id: "opt6", text: "kecil" }
        ]
    },
    {
        paragraph: "Arno menyerahkan {0} kartu tanda penduduk plus kartu keluarga untuk mendapatkan beras murah. Panitia lantas memberinya kupon beras dan menyuruhnya {1}. Akan tetapi, mereka kecewa karena berasnya tidak ada. Sementara itu, warga terus berdatangan. Mereka pun kecewa dan mengatakan bahwa mereka {2}.",
        blanks: [
            { id: 0, correctAnswer: "fotokopi" },
            { id: 1, correctAnswer: "antre" },
            { id: 2, correctAnswer: "tertipu" }
        ],
        options: [
            { id: "opt1", text: "fotokopi" },
            { id: "opt2", text: "photocopy" },
            { id: "opt3", text: "potocopy" },
            { id: "opt4", text: "antre" },
            { id: "opt5", text: "antri" },
            { id: "opt6", text: "tertipu" },
            { id: "opt7", text: "ketipu" }
        ]
    }
];

export default function DragAndDropGame() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [selectedBlank, setSelectedBlank] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [results, setResults] = useState<{ [key: number]: boolean }>({});
    const [message, setMessage] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const gameData = allGameData[currentQuestionIndex];

    const handleBlankPress = (blankId: number) => {
        if (!checked) {
            setSelectedBlank(blankId);
        }
    };

    const handleOptionPress = (optionText: string) => {
        if (selectedBlank !== null && !checked) {
            setAnswers(prev => ({ ...prev, [selectedBlank]: optionText }));
            setSelectedBlank(null);
            
            if (checked) {
                setChecked(false);
                setResults({});
                setMessage('');
            }
        }
    };

    const handleRemoveAnswer = (blankId: number) => {
        if (!checked) {
            setAnswers(prev => {
                const newAnswers = { ...prev };
                delete newAnswers[blankId];
                return newAnswers;
            });
        }
    };

    const checkAnswers = async () => {
        if (isSubmitting) return;

        const newResults: { [key: number]: boolean } = {};
        let allCorrect = true;
        let allFilled = true;

        gameData.blanks.forEach(blank => {
            const userAnswer = answers[blank.id];
            if (!userAnswer) {
                allFilled = false;
            } else {
                const isCorrect = userAnswer === blank.correctAnswer;
                newResults[blank.id] = isCorrect;
                if (!isCorrect) allCorrect = false;
            }
        });

        if (!allFilled) {
            setMessage('Lengkapi semua jawaban terlebih dahulu!');
            return;
        }

        setResults(newResults);
        setChecked(true);

        if (allCorrect) {
            setMessage('Selamat! Semua jawaban benar! 🎉');
        } else {
            setMessage('Masih ada jawaban yang salah. Coba lagi!');
        }
    };

    const handleNext = async () => {
        if (currentQuestionIndex < allGameData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setAnswers({});
            setSelectedBlank(null);
            setChecked(false);
            setResults({});
            setMessage('');
        } else {
            if (!isCompleted) {
                setIsSubmitting(true);
                try {
                    const result = await updateGameProgress('dragdrop');
                    
                    if (result.success) {
                        setIsCompleted(true);
                        Alert.alert(
                            'Selamat! 🎉',
                            'Kamu berhasil menyelesaikan semua soal Drag and Drop!\n\nKamu mendapat +1000 tinta ✨',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => router.push('/(tabs)/bermain')
                                }
                            ]
                        );
                    } else if (result.error === 'Already completed') {
                        setIsCompleted(true);
                        router.push('/(tabs)/bermain');
                    }
                } catch (error) {
                    console.error('Error updating game progress:', error);
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                router.push('/(tabs)/bermain');
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setAnswers({});
            setSelectedBlank(null);
            setChecked(false);
            setResults({});
            setMessage('');
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSelectedBlank(null);
        setChecked(false);
        setResults({});
        setMessage('');
    };

    const renderParagraph = () => {
        const parts = gameData.paragraph.split(/(\{\d+\})/);
        
        return (
            <Text className="text-base text-gray-900 leading-7">
                {parts.map((part, index) => {
                    const match = part.match(/\{(\d+)\}/);
                    if (match) {
                        const blankId = parseInt(match[1]);
                        const answer = answers[blankId];
                        const result = results[blankId];
                        const isSelected = selectedBlank === blankId;

                        return (
                            <Pressable
                                key={index}
                                onPress={() => handleBlankPress(blankId)}
                                disabled={checked}
                            >
                                <View
                                    className={`inline-flex items-center justify-center min-w-[100px] mx-1 px-3 py-1.5 border rounded-lg top-7 ${
                                        checked
                                            ? result
                                                ? 'border-green-600 bg-green-100'
                                                : 'border-red-600 bg-red-100'
                                            : isSelected
                                            ? 'border-blue-500 bg-blue-50'
                                            : answer
                                            ? 'border-gray-800 bg-gray-100'
                                            : ' border-black bg-foundation-red-light'
                                    }`}
                                >
                                    {answer ? (
                                        <View className="flex-row items-center justify-between">
                                            <Text className="font-satoshi-bold text-gray-900 mr-2 ">{answer}</Text>
                                            {!checked && (
                                                <Pressable onPress={() => handleRemoveAnswer(blankId)}>
                                                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                                                </Pressable>
                                            )}
                                        </View>
                                    ) : (
                                        <Text className="text-gray-400 text-s">___</Text>
                                    )}
                                </View>
                            </Pressable>
                        );
                    }
                    return <Text key={index}>{part}</Text>;
                })}
            </Text>
        );
    };

    const usedOptions = new Set(Object.values(answers));

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                                
                <SafeAreaView className="flex-1" edges={['bottom']}>
                    <View className="pt-16 px-6 pb-4">
                        <View className="flex-row items-center justify-between">
                            <Pressable 
                                onPress={() => {
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.push('/(tabs)/belajar');
                                    }
                                }}
                                className="w-10 h-10 items-center justify-center"
                                >
                                <Ionicons name="chevron-back" size={20} color="#000000" />
                            </Pressable>
        
                            <Text className="flex-1 text-center text-lg font-satoshi-bold text-gray-900 mx-4" numberOfLines={2}>
                                Drag and Drop
                            </Text>
                            <View className="w-10 h-10" />
                        </View>
                    </View>
        
                    <View className="h-[1px] bg-gray-200 mx-6" />

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="mx-6 mt-4 mb-2">
                        <Text className="text-sm text-gray-600 text-center font-satoshi-medium">
                            Soal {currentQuestionIndex + 1} dari {allGameData.length}
                        </Text>
                    </View>

                    <View className="mx-6 mb-6 p-4 bg-white border-2 border-black rounded-2xl shadow-sm">
                        {renderParagraph()}
                    </View>

                    <View className="mx-6 mb-3 px-4 py-2 bg-[#7A3E3E] rounded-xl">
                        <Text className="text-white text-sm font-satoshi-bold text-center">
                            {selectedBlank !== null 
                                ? `Ambil ${gameData.blanks.length} kata yang dirasa tepat`
                                : 'Ketuk kotak kosong, lalu pilih kata'}
                        </Text>
                    </View>

                    <View className="mx-6 mb-6 flex-row flex-wrap justify-center gap-3">
                        {gameData.options.map((option) => {
                            const isUsed = usedOptions.has(option.text);
                            
                            return (
                                <Pressable
                                    key={option.id}
                                    onPress={() => handleOptionPress(option.text)}
                                    disabled={isUsed || checked}
                                    className={`px-6 py-3 rounded-xl border-2 ${
                                        isUsed
                                            ? 'bg-gray-200 border-gray-400'
                                            : 'bg-foundation-yellow2-dark border-black'
                                    }`}
                                    style={({ pressed }) => [
                                        {
                                            opacity: isUsed || checked ? 0.5 : pressed ? 0.8 : 1,
                                            transform: [{ scale: pressed && !isUsed && !checked ? 0.95 : 1 }]
                                        }
                                    ]}
                                >
                                    <Text className={`font-satoshi-bold ${
                                        isUsed ? 'text-gray-500' : 'text-white'
                                    }`}>
                                        {option.text}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {message && (
                        <View className="mx-6 mb-4">
                            <View className={`px-4 py-3 rounded-xl ${
                                message.includes('Selamat') 
                                    ? 'bg-green-100' 
                                    : message.includes('salah')
                                    ? 'bg-red-100'
                                    : 'bg-yellow-100'
                            }`}>
                                <Text className={`text-center font-satoshi-bold ${
                                    message.includes('Selamat') 
                                        ? 'text-green-800' 
                                        : message.includes('salah')
                                        ? 'text-red-800'
                                        : 'text-yellow-800'
                                }`}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View className="mx-6 flex-row justify-center gap-4">
                        {currentQuestionIndex > 0 && !checked && (
                            <Pressable
                                onPress={handlePrevious}
                                className="flex-1 py-3.5 rounded-xl border-2 border-gray-800 bg-white"
                                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                            >
                                <Text className="text-center font-satoshi-bold text-gray-900">
                                    Sebelumnya
                                </Text>
                            </Pressable>
                        )}

                        {checked && (
                            <Pressable
                                onPress={handleRetry}
                                className="flex-1 py-3.5 rounded-3xl border-2 border-foundation-red-darker bg-foundation-red-normal"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <Text className="text-center font-satoshi-bold text-white">
                                    Coba Lagi
                                </Text>
                            </Pressable>
                        )}

                        {!checked ? (
                            <Pressable
                                onPress={checkAnswers}
                                disabled={isSubmitting}
                                className="flex-1 py-3.5 rounded-3xl bg-foundation-blue-normal border-2 border-foundation-blue-darker"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text className="text-center font-satoshi-bold text-white">
                                        Periksa
                                    </Text>
                                )}
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={handleNext}
                                disabled={isSubmitting}
                                className="flex-1 py-3.5 rounded-3xl bg-foundation-blue-normal border-2 border-foundation-blue-darker"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text className="text-center font-satoshi-bold text-white">
                                        {currentQuestionIndex < allGameData.length - 1 ? 'Selanjutnya' : 'Selesai'}
                                    </Text>
                                )}
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
