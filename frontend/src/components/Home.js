import MainContent from "./MainContent";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import "./Home.css";

const Home = () => {
    return(
        <main class="layout">
        <div class="home-container">
            <div class="sidebar-left">
                <SidebarLeft />
            </div>

            <div class="main-content">
                <MainContent />
            </div>

            <div class="sidebar-right">
                <SidebarRight />
            </div>
        </div>
        </main>
    )
}
export default Home;