import * as React from "react";
import { View, Text, StyleSheet, useWindowDimensions, StatusBar, SafeAreaView } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Food from "./Food";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import Header from "./Header";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export function Game(): JSX.Element {
    const { width, height } = useWindowDimensions();
    const GAME_BOUNDS = { xMin: 0, yMin: 0, xMax: Math.floor(width / 10) - 3, yMax: Math.floor(height / 10) - 3 };

    const [direction, setDirection] = React.useState<Direction>(Direction.Right);
    const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<number>(0);

    React.useEffect(() => {
        if (!isGameOver) {
            const intervalId = setInterval(() => {
                !isPaused && moveSnake();
            }, MOVE_INTERVAL);

            return () => clearInterval(intervalId);
        }
    }, [snake, isGameOver, isPaused]);

    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = { ...snakeHead }; // creating a copy

        // Check if the game is over
        if (checkGameOver(newHead, GAME_BOUNDS)) {
            setIsGameOver(true);
            return;
        }

        // Move the snake
        switch (direction) {
            case Direction.Up:
                newHead.y -= 1;
                break;
            case Direction.Down:
                newHead.y += 1;
                break;
            case Direction.Left:
                newHead.x -= 1;
                break;
            case Direction.Right:
                newHead.x += 1;
                break;
        }

        // Check if the snake eats the food
        if (checkEatsFood(newHead, food, 2)) {
            setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
            setSnake([newHead, ...snake]);
            setScore((prev) => prev + SCORE_INCREMENT);
        } else {
            setSnake([newHead, ...snake.slice(0, -1)]);
        }
    };

    const handleGesture = (event: GestureEventType) => {
        const { translationX, translationY } = event.nativeEvent;

        // Prevent the snake from reversing direction
        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0 && direction !== Direction.Left) {
                setDirection(Direction.Right);
            } else if (translationX < 0 && direction !== Direction.Right) {
                setDirection(Direction.Left);
            }
        } else {
            if (translationY > 0 && direction !== Direction.Up) {
                setDirection(Direction.Down);
            } else if (translationY < 0 && direction !== Direction.Down) {
                setDirection(Direction.Up);
            }
        }
    };

    const reloadGame = () => {
        setIsGameOver(false);
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(FOOD_INITIAL_POSITION);
        setScore(0);
        setDirection(Direction.Right);
        setIsPaused(false);
    };

    const pauseGame = () => {
        setIsPaused((prev) => !prev);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
                <SafeAreaView style={styles.container}>
                    <Header isPaused={isPaused} pauseGame={pauseGame} reloadGame={reloadGame}>
                        <Text style={styles.scoreText}>{score}</Text>
                    </Header>
                    <View style={styles.boundaries}>
                        <Snake snake={snake} />
                        <Food x={food.x} y={food.y} />
                    </View>
                    {isGameOver && <Text style={styles.gameOverText}>Game Over!</Text>}
                </SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 35,
        backgroundColor: Colors.primary,
    },
    boundaries: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: Colors.background,
    },
    gameOverText: {
        position: "absolute",
        alignSelf: "center",
        top: "50%",
        fontSize: 24,
        color: Colors.primary,
    },
    scoreText: {
        fontWeight: "bold",
        fontSize: 22,
        color: Colors.primary,
    },
});