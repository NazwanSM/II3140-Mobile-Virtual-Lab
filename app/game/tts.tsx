import { updateGameProgress } from '@/lib/actions/progress';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const puzzleData = {
    rows: 14,
    cols: 15,

    grid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],

    numbers: [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 0, 0, 6, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    
    answers: [
        [null, null, null, null, null, null, null, null, 'S', null, null, null, null, null, null],
        [null, null, null, null, 'A', 'P', 'O', 'T', 'E', 'K', null, null, null, null, null],
        [null, null, null, null, null, 'U', null, null, 'R', null, null, null, null, null, null],
        [null, null, null, 'E', null, 'E', null, 'K', 'U', 'A', 'L', 'I', 'T', 'A', 'S'],
        [null, null, null, 'J', null, 'B', null, null, null, null, null, null, null, 'N', null],
        [null, null, 'K', 'A', 'P', 'I', 'T', 'A', 'L', null, null, null, null, 'T', null],
        [null, null, null, 'A', null, null, 'A', null, null, null, null, null, null, 'R', null],
        [null, null, null, 'N', null, null, 'N', null, null, null, null, null, null, 'E', null],
        [null, null, null, null, 'R', null, 'Y', null, null, null, null, null, null, null, null],
        [null, null, null, null, 'I', 'J', 'A', 'Z', 'A', 'H', null, null, null, null, null],
        ['N', 'A', 'P', 'A', 'S', null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, 'I', null, null, null, null, null, null, null, null, null, null],
        [null, 'E', 'F', 'E', 'K', 'T', 'I', 'F', null, null, null, null, null, null, null],
        [null, null, null, null, 'O', null, null, null, null, null, null, null, null, null, null],
    ],

    clues: {
        across: [
            { num: 2, clue: "Tempat penjualan obat-obatan; kata baku dari 'Apotik' (2)", answer: "APOTEK" },
            { num: 5, clue: "Bentuk baku dari kata 'kwalitas' (5)", answer: "KUALITAS" },
            { num: 7, clue: "Huruf pertama pada kalimat dan nama orang harus ditulis dengan huruf ... (7)", answer: "KAPITAL" },
            { num: 10, clue: "Dokumen resmi tanda kelulusan sekolah; sering salah ditulis menjadi 'ijasah' (10)", answer: "IJAZAH" },
            { num: 11, clue: "Bentuk baku dari kata 'nafas' (11)", answer: "NAPAS" },
            { num: 12, clue: "Kalimat yang mampu menyampaikan gagasan secara jelas dan tepat disebut kalimat ... (12)", answer: "EFEKTIF" },
        ],
        down: [
            { num: 1, clue: "Kalimat perintah atau ajakan diakhiri dengan tanda ... (1)", answer: "SERU" },
            { num: 3, clue: "Pedoman resmi penulisan huruf, tanda baca, dan ejaan Bahasa Indonesia (3)", answer: "PUEBI" },
            { num: 4, clue: "Aturan penulisan huruf besar-kecil, tanda baca, dan penulisan kata disebut ... (4)", answer: "EJAAN" },
            { num: 6, clue: "Bentuk baku dari kata 'antri' (6)", answer: "ANTRE" },
            { num: 8, clue: "Kalimat berupa pertanyaan disebut kalimat ... (8)", answer: "TANYA" },
            { num: 9, clue: "Bentuk baku dari kata 'resiko' (9)", answer: "RISIKO" },
        ],
    },
};

export default function CrosswordGame() {
    const { rows, cols, grid, numbers, answers, clues } = puzzleData;
    const router = useRouter();
    const inputRef = useRef<TextInput>(null);
    const screenWidth = Dimensions.get('window').width;
    const gridSize = Math.min(screenWidth - 48, 450);
    const cellSize = gridSize / cols;

    const [gridState, setGridState] = useState(
        Array(rows).fill(null).map(() => Array(cols).fill(''))
    );

    const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
    const [direction, setDirection] = useState<'across' | 'down'>('across');
    const [message, setMessage] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [cellStatus, setCellStatus] = useState<('correct' | 'incorrect' | null)[][]>(
        Array(rows).fill(null).map(() => Array(cols).fill(null))
    );
    const [showCluesModal, setShowCluesModal] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 1) {
                    setActiveCell({ row: r, col: c });
                    return;
                }
            }
        }
    }, []);

    const highlightedCells = useMemo(() => {
        const cells = new Set();
        const { row: startRow, col: startCol } = activeCell;

        if (grid[startRow][startCol] === 0) return cells;

        if (direction === 'across') {
            let currentCol = startCol;
            while (currentCol > 0 && grid[startRow][currentCol - 1] === 1) {
                currentCol--;
            }
            while (currentCol < cols && grid[startRow][currentCol] === 1) {
                cells.add(`${startRow}-${currentCol}`);
                currentCol++;
            }
        } else {
            let currentRow = startRow;
            while (currentRow > 0 && grid[currentRow - 1][startCol] === 1) {
                currentRow--;
            }
            while (currentRow < rows && grid[currentRow][startCol] === 1) {
                cells.add(`${currentRow}-${startCol}`);
                currentRow++;
            }
        }
        return cells;
    }, [activeCell, direction, grid, rows, cols]);

    const activeClue = useMemo(() => {
        const { row: activeRow, col: activeCol } = activeCell;
        if (grid[activeRow][activeCol] === 0) return null;

        let clueNum = 0;
        let tempRow = activeRow;
        let tempCol = activeCol;

        if (direction === 'across') {
            while (tempCol >= 0 && grid[tempRow][tempCol] === 1) {
                if (numbers[tempRow][tempCol] > 0) {
                    if (tempCol === 0 || grid[tempRow][tempCol - 1] === 0) {
                        clueNum = numbers[tempRow][tempCol];
                    }
                }
                if (clueNum > 0) break;
                if (tempCol === 0) break;
                tempCol--;
            }
            if (clueNum === 0 && numbers[activeRow][activeCol] > 0 && (activeCol === 0 || grid[activeRow][activeCol - 1] === 0)) {
                clueNum = numbers[activeRow][activeCol];
            }
            return clues.across.find(clue => clue.num === clueNum)?.clue || null;
        } else {
            while (tempRow >= 0 && grid[tempRow][tempCol] === 1) {
                if (numbers[tempRow][tempCol] > 0) {
                    if (tempRow === 0 || grid[tempRow - 1]?.[tempCol] === 0) {
                        clueNum = numbers[tempRow][tempCol];
                    }
                }
                if (clueNum > 0) break;
                if (tempRow === 0) break;
                tempRow--;
            }
            if (clueNum === 0 && numbers[activeRow][activeCol] > 0 && (activeRow === 0 || grid[activeRow - 1]?.[activeCol] === 0)) {
                clueNum = numbers[activeRow][activeCol];
            }
            return clues.down.find(clue => clue.num === clueNum)?.clue || null;
        }
    }, [activeCell, direction, grid, numbers, clues]);

    const handleCellClick = (row: number, col: number) => {
        if (grid[row][col] === 0) return;

        if (activeCell.row === row && activeCell.col === col) {
            setDirection(direction === 'across' ? 'down' : 'across');
        }

        setActiveCell({ row, col });
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInputChange = (text: string) => {
        const { row, col } = activeCell;
        if (grid[row][col] === 0) return;

        setMessage('');
        
        if (isChecked) {
            setIsChecked(false);
            setCellStatus(Array(rows).fill(null).map(() => Array(cols).fill(null)));
        }

        if (text.length > 0) {
            const letter = text[text.length - 1].toUpperCase();
            if (letter.match(/[A-Z]/)) {
                const newGridState = gridState.map((r) => [...r]);
                newGridState[row][col] = letter;
                setGridState(newGridState);

                let nextRow = row;
                let nextCol = col;

                if (direction === 'across') {
                    nextCol++;
                } else {
                    nextRow++;
                }

                while (nextRow < rows && nextCol < cols) {
                    if (grid[nextRow]?.[nextCol] === 1) {
                        setActiveCell({ row: nextRow, col: nextCol });
                        return;
                    }
                    if (direction === 'across') {
                        nextCol++;
                    } else {
                        nextRow++;
                    }
                }
            }
        }
    };

    const handleBackspace = () => {
        const { row, col } = activeCell;
        const newGridState = gridState.map((r) => [...r]);
        
        if (newGridState[row][col] !== '') {
            newGridState[row][col] = '';
            setGridState(newGridState);
            return;
        }

        let prevRow = row;
        let prevCol = col;

        if (direction === 'across') {
            prevCol--;
        } else {
            prevRow--;
        }

        while (prevRow >= 0 && prevCol >= 0) {
            if (grid[prevRow][prevCol] === 1) {
                newGridState[prevRow][prevCol] = '';
                setGridState(newGridState);
                setActiveCell({ row: prevRow, col: prevCol });
                return;
            }
            if (direction === 'across') {
                prevCol--;
            } else {
                prevRow--;
            }
        }
    };

    const handleClueClick = (dir: 'across' | 'down', num: number) => {
        let startRow: number | undefined, startCol: number | undefined;

        outerLoop: for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (numbers[r][c] === num) {
                    const isValidStart = (dir === 'across' && (c === 0 || grid[r][c - 1] === 0) && grid[r][c + 1] === 1) ||
                                        (dir === 'down' && (r === 0 || grid[r - 1][c] === 0) && grid[r + 1]?.[c] === 1);

                    if (isValidStart) {
                        startRow = r;
                        startCol = c;
                        break outerLoop;
                    } else if (startRow === undefined) {
                        startRow = r;
                        startCol = c;
                    }
                }
            }
        }

        if (startRow !== undefined && startCol !== undefined && grid[startRow][startCol] === 1) {
            setDirection(dir);
            setActiveCell({ row: startRow, col: startCol });
            setShowCluesModal(false);
        }
    };

    const checkAnswers = async () => {
        if (isSubmitting || isCompleted) return;

        let allCorrect = true;
        const newCellStatus: ('correct' | 'incorrect' | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 1) {
                    const userAnswer = gridState[r][c]?.toUpperCase() || '';
                    const correctAnswer = answers[r][c]?.toUpperCase() || '';

                    if (userAnswer !== '') {
                        if (userAnswer === correctAnswer) {
                            newCellStatus[r][c] = 'correct';
                        } else {
                            newCellStatus[r][c] = 'incorrect';
                            allCorrect = false;
                        }
                    } else {
                        if (correctAnswer !== '') {
                            allCorrect = false;
                        }
                    }
                }
            }
        }

        setCellStatus(newCellStatus);
        setIsChecked(true);

        if (allCorrect) {
            setMessage('Selamat! Semua jawaban benar!');
            
            if (!isCompleted) {
                setIsSubmitting(true);
                try {
                    const result = await updateGameProgress('tts');
                    
                    if (result.success) {
                        setIsCompleted(true);
                        Alert.alert(
                            'Selamat! 🎉',
                            'Kamu berhasil menyelesaikan Teka-Teki Silang!\n\nKamu mendapat +1000 tinta ✨',
                            [{ text: 'OK' }]
                        );
                    } else if (result.error === 'Already completed') {
                        setIsCompleted(true);
                    }
                } catch (error) {
                    console.error('Error updating game progress:', error);
                } finally {
                    setIsSubmitting(false);
                }
            }
        } else {
            setMessage('Masih ada jawaban yang salah. Coba lagi!');
        }
    };

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
                                Teka - Teki Silang
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

                    <View className="mx-6 mt-4 mb-4">
                        <View 
                            style={{
                                width: gridSize,
                                height: (gridSize / cols) * rows,
                                alignSelf: 'center',
                            }}
                            className="border border-gray-800 rounded-xl overflow-hidden bg-gray-400"
                        >
                            {grid.map((rowArr, r) => (
                                <View key={r} className="flex-row" style={{ height: cellSize }}>
                                    {rowArr.map((cell, c) => {
                                        const isBlocker = cell === 0;
                                        const cellNumber = numbers[r][c] || 0;
                                        const isActive = activeCell.row === r && activeCell.col === c;
                                        const isHighlighted = highlightedCells.has(`${r}-${c}`);
                                        const status = cellStatus[r][c];

                                        let bgColor = 'bg-gray-800';
                                        if (!isBlocker) {
                                            if (status === 'correct') {
                                                bgColor = 'bg-green-200';
                                            } else if (status === 'incorrect') {
                                                bgColor = 'bg-red-200';
                                            } else if (isActive) {
                                                bgColor = 'bg-blue-300';
                                            } else if (isHighlighted) {
                                                bgColor = 'bg-yellow-100';
                                            } else {
                                                bgColor = 'bg-white';
                                            }
                                        }

                                        return (
                                            <Pressable
                                                key={`${r}-${c}`}
                                                onPress={() => handleCellClick(r, c)}
                                                style={{ 
                                                    width: cellSize, 
                                                    height: cellSize,
                                                    borderWidth: isBlocker ? 0 : 0.5,
                                                }}
                                                className={`${bgColor} border-foundation-red-darker relative items-center justify-center`}
                                            >
                                                {!isBlocker && (
                                                    <>
                                                        {cellNumber > 0 && (
                                                            <Text 
                                                                style={{ fontSize: cellSize * 0.25 }}
                                                                className="absolute top-0 left-0.5 font-satoshi-bold text-gray-700"
                                                            >
                                                                {cellNumber}
                                                            </Text>
                                                        )}
                                                        <Text 
                                                            style={{ fontSize: cellSize * 0.5 }}
                                                            className="font-satoshi-bold text-gray-900"
                                                        >
                                                            {gridState[r][c]}
                                                        </Text>
                                                    </>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="mx-6 mb-3 p-3 bg-foundation-red-light border border-foundation-red-darker rounded-lg">
                        <Text className="text-base text-foundation-red-darker text-center font-satoshi-bold">
                            {activeClue || 'Ketuk kotak untuk memulai'}
                        </Text>
                    </View>
                    <TextInput
                        ref={inputRef}
                        value=""
                        onChangeText={handleInputChange}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                handleBackspace();
                            }
                        }}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        style={{ position: 'absolute', left: -1000 }}
                    />

                    {message && (
                        <Text className={`text-center mb-4 text-base font-satoshi-bold ${message.includes('Selamat') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </Text>
                    )}

                    <View className="flex-row justify-center gap-3 mx-6 mb-4">
                        <Pressable
                            onPress={() => setShowCluesModal(true)}
                            className="flex-1 bg-foundation-blue-light border border-foundation-blue-darker py-3 rounded-xl"
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        >
                            <Text className="text-foundation-blue-darker text-center font-satoshi-bold text-base">
                                Lihat Petunjuk
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={checkAnswers}
                            disabled={isSubmitting}
                            className={`flex-1 py-3 rounded-xl border ${
                                isCompleted 
                                    ? 'bg-green-100 border-green-500' 
                                    : 'bg-green-200 border-green-900'
                            }`}
                            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#166534" />
                            ) : (
                                <Text className={`text-center font-satoshi-bold text-base ${
                                    isCompleted ? 'text-green-600' : 'text-green-900'
                                }`}>
                                    {isCompleted ? '✓ Selesai' : 'Periksa'}
                                </Text>
                            )}
                        </Pressable>
                    </View>

                    <View className="mx-6">
                        <Text className="text-sm font-satoshi-bold text-gray-700 mb-2 text-center">
                            Keyboard Virtual
                        </Text>
                        <View className="flex-row flex-wrap justify-center gap-1">
                            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                                <Pressable
                                    key={letter}
                                    onPress={() => handleInputChange(letter)}
                                    className="bg-gray-200 w-9 h-9 items-center justify-center rounded-lg"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                                >
                                    <Text className="font-satoshi-bold text-gray-900">{letter}</Text>
                                </Pressable>
                            ))}
                            <Pressable
                                onPress={handleBackspace}
                                className="bg-foundation-red-normal px-4 h-9 items-center justify-center rounded-lg"
                                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                            >
                                <Ionicons name="backspace-outline" size={20} color="white" />
                            </Pressable>
                            <Pressable
                                onPress={() => setDirection(direction === 'across' ? 'down' : 'across')}
                                className="bg-foundation-blue-normal px-4 h-9 items-center justify-center rounded-lg"
                                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                            >
                                <Text className="font-satoshi-bold text-white text-xs">
                                    {direction === 'across' ? '→' : '↓'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    visible={showCluesModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCluesModal(false)}
                >
                    <View className="flex-1 bg-black/50">
                        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
                            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                                <Text className="text-xl font-satoshi-bold text-gray-900">Petunjuk</Text>
                                <Pressable onPress={() => setShowCluesModal(false)} className="p-2">
                                    <Ionicons name="close" size={28} color="#000" />
                                </Pressable>
                            </View>

                            <ScrollView className="flex-1 p-4">
                                <View className="mb-6">
                                    <Text className="text-lg font-satoshi-bold text-gray-900 mb-3">Mendatar</Text>
                                    {clues.across.map(({ num, clue }) => (
                                        <Pressable
                                            key={`a-${num}`}
                                            onPress={() => handleClueClick('across', num)}
                                            className="mb-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <Text className="text-sm text-gray-800">
                                                <Text className="font-satoshi-bold">{num}.</Text> {clue}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View className="mb-6">
                                    <Text className="text-lg font-satoshi-bold text-gray-900 mb-3">Menurun</Text>
                                    {clues.down.map(({ num, clue }) => (
                                        <Pressable
                                            key={`d-${num}`}
                                            onPress={() => handleClueClick('down', num)}
                                            className="mb-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <Text className="text-sm text-gray-800">
                                                <Text className="font-satoshi-bold">{num}.</Text> {clue}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}
