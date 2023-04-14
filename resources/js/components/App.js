import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
    return (
        <div>Start page</div>
    )
}

export default App

if (document.getElementById('root')) {
    ReactDOM.render(
        <React.StrictMode>
        <App/>
        </React.StrictMode>,
        document.getElementById('root')
    )
}
