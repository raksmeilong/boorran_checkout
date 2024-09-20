import React from "react"

import Header from "./components/Header"
import Footer from "./components/Footer"
import Credit from "./components/Credit"

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Credit />
      {/* <Footer /> */}
    </>
  )
}

export default MainLayout
