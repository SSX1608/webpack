import { tellYou } from "./world.js";

export function say(name){
    return "hello " + name +";"+ tellYou();
}