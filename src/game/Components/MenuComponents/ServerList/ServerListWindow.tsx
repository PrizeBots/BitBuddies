import { useAppSelector } from '../../../../hooks'
import { ServerListInfo } from './ServerListInfo'
import './ServerListWindow.css'

export function ServerListWindow() {
  const showServersList = useAppSelector((state) => state.websiteStateStore.showGameServersList)
  return(
    <>
      {showServersList && <div className='list-wrapper'>
        <ServerListInfo />
      </div>}
    </>
  )
}