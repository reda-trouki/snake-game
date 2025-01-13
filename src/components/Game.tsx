import * as REACT from "react"
import { View, Text, SafeAreaView, StyleSheet, Dimensions, useWindowDimensions } from "react-native"
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types"
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Food from "./Food";



const SNAKE_INITIAL_POSITION = [{ x:5, y:5 }];
const FOOD_INIITIAL_POSITION = { x:5, y: 20 };
const MOVE_INTERNAL = 50;
const SCORE_INCREMENT = 10;

export function Game():JSX.Element {
    const { width, height } = useWindowDimensions();
    const GAME_BOUNDS = { xMin: 0, yMin: 0, xMax: (width/10)-3, yMax: (height/10)-3 };

    const [direction, setDirection] = REACT.useState<Direction>(Direction.Right);
    const [snake, setSnake] = REACT.useState<Coordinate[]>(
        SNAKE_INITIAL_POSITION
    );
    const [food, setFood] = REACT.useState<Coordinate>(
        FOOD_INIITIAL_POSITION
    );
    const [isGameOver, setIsGameOver] = REACT.useState<boolean>(false);
    const [isPaused, setIsPaused] = REACT.useState<boolean>(false);

    REACT.useEffect(() =>{
        if(!isGameOver){
            const intervalId = setInterval(() => {
               !isPaused && moveSnake();
            },MOVE_INTERNAL);

            return () => clearInterval(intervalId);
        }
    }, [snake, isGameOver, isPaused])

    const generateFood = () =>{
        setFood({
            x: Math.floor(Math.random() * (GAME_BOUNDS.xMax - GAME_BOUNDS.xMin)) + GAME_BOUNDS.xMin + 1,
            y: Math.floor(Math.random() * (GAME_BOUNDS.yMax - GAME_BOUNDS.yMin)) + GAME_BOUNDS.yMin + 1
        })
    }

    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = {...snakeHead}; // creating a copy
        // game over
        if(checkGameOver(snakeHead, GAME_BOUNDS)){
            setIsGameOver((prev)=>!prev);
            return;
        }

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
        // if its food grow snake

        


        setSnake([newHead, ...snake.slice(0, -1)]);
    }

    const handleGesture = (event: GestureEventType) => {
        // console.log(event.nativeEvent);
        const { translationX, translationY } = event.nativeEvent;
        if(Math.abs(translationX) > Math.abs(translationY)) {
            if(translationX > 0) {
                // moving right
                setDirection(Direction.Right);
            } else {
                // moving left
                setDirection(Direction.Left);
            }
        }else{
            if (translationY > 0) {
                // moving down
                setDirection(Direction.Down);
            } else {
                // moving up
                setDirection(Direction.Up);
            }
        }
    }

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
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
        backgroundColor: Colors.primary,
    },
    boundaries: {
        flex: 1,
        marginTop: 40,
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
})