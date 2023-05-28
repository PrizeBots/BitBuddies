// import { useAppSelector } from "../../../hooks"
import './WaveLoader.css'
// let loadingState = false;
export function WaveLoader() {
  // const gameLoading = useAppSelector((state) => state.websiteStateStore.gameLoading)
  

  // if (gameLoading) {
  //   loadingState = true;
  // }

  // if (!gameLoading && loadingState) {
  //   setTimeout(() => {
  //     loadingState = false
  //   }, 1000)
  //   const ring_element = document.getElementById("ring-wrapper-id");
  //   if (ring_element) {
  //     console.log("fading out ..")
  //     ring_element.style.animation = "fade-out 2s forwards";
  //   }
  // }

  // const fadeOut = () => {
  //   const ring_element = document.getElementById("ring-wrapper-id");
  //   if (ring_element)
  //     ring_element.style.animation = "fade-out 2s forwards";
  // }
  return(
    <div className="center">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
    
  )
}