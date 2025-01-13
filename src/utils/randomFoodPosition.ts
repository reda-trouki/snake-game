import { Coordinate } from "../types/types"

export const randomFoodPosition = (MaxX:number, MaxY:number):Coordinate =>{
        return {
            x: Math.floor(Math.random() * MaxX),
            y: Math.floor(Math.random() * MaxY )
        }
    }