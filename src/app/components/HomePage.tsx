import Appbar from "./Appbar"
import GetTokens from "./GetTokens"

export default function HomePage() {
    return <div className="grid">
        <Appbar />
        <div className="py-24 px-28">
            <GetTokens />
        </div>
    </div>
}