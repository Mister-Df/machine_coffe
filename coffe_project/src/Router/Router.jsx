import { BrowserRouter, Routes, Route } from "react-router-dom"
import CommandClient from "../component/CommandClient"
import Navigate from "../component/Navigate"
import MachineTask from "../component/MachineTask"

export default function Router() {
    return (

        <BrowserRouter>
            <div className="flex gap-3">
                <Navigate />
                <Routes>
                    <Route path="machine" element={<MachineTask />} />
                    <Route path="command" element={<CommandClient />} />
                </Routes>
            </div>
        </BrowserRouter>

    )
}
