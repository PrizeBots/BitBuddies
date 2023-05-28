import { useAppSelector } from "../../../hooks"
import './Loader.css'
let loadingState = false;
export function Loader() {
  const gameLoading = useAppSelector((state) => state.websiteStateStore.gameLoading)
  

  if (gameLoading) {
    loadingState = true;
  }

  if (!gameLoading && loadingState) {
    const ring_element = document.getElementById("ring-wrapper-id");
    setTimeout(() => {
      loadingState = false
    }, 3000)
    if (ring_element) {
      ring_element.style.animation = "fade-out 3s forwards";
      console.log("fading out ..")
      setTimeout(() => {
        try {
          ring_element.remove()
        } catch (err) {
          console.log("unable to delete ring ")
        }
        
      }, 3000)
      
    }
  }

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