import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

let user1:object = {
    who:"general-Kenobi",
    when:"2020-01-20",
  }
let userMsg1:object = {
    who:"general-Kenobi",
    data:"Hello there",
    when: new Date() 

  }
let user2:object = {
    who:"laber-saber-robot-collector",
  }
let user2Msg1:object = {
    who:"laber-saber-robot-collector",
    data:"general-Kenobi!",
    when: new Date()
  }
let localChatHistory:object[] = [
{
  message: userMsg1,
  sender: user1
  },
  {
  message: user2Msg1,
  sender: user2
    }] 
export const localMessages:Writable<any> = writable(localChatHistory)
