const color = ["rgb(255,0,0)","rgb(57,52,233)","rgb(62,193,38)","rgb(181,38,193)","rgba(8,222,212,0.83)",
    "rgba(246,230,40,0.77)","rgba(255,133,0,0.9)","rgba(255,188,0,0.94)","rgb(127,127,127)","rgb(54,31,108)"]
const RandomColor = ()=>{
    return color[Math.round(Math.random()*9)] 
}
export default RandomColor