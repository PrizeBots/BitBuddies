import { useAppSelector } from "../../../hooks"
import './Loader.css'
let loadingState = false;
export function Loader() {
  const gameLoading = useAppSelector((state) => state.websiteStateStore.gameLoading)
  

  if (gameLoading) {
    loadingState = true;
  }

  if (!gameLoading && loadingState) {
    setTimeout(() => {
      loadingState = false
    }, 1000)
    const ring_element = document.getElementById("ring-wrapper-id");
    if (ring_element) {
      console.log("fading out ..")
      ring_element.style.animation = "fade-out 2s forwards";
    }
  }

  // const fadeOut = () => {
  //   const ring_element = document.getElementById("ring-wrapper-id");
  //   if (ring_element)
  //     ring_element.style.animation = "fade-out 2s forwards";
  // }
  return(
    <>
    {
      loadingState && 
        <div className="ring-wrapper" id="ring-wrapper-id">
          <div className="ring">Loading
            <span className="ring-span"></span>
          </div>
        </div>
    }
    </>
    
  )
}