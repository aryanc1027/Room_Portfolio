import './style.css'
import Experience from "./Experience/Experience.js"
import { inject } from "@vercel/analytics"

const experience = new Experience(document.querySelector(".experience-canvas"))
inject()