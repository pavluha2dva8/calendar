import styled from '@emotion/styled'
import { toPng } from 'html-to-image'
import React from 'react'

const Button = styled.button`
  padding: 8px 16px;
  background-color: #5bbf4c;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #4f9041;
  }
`

const CalendarImageDownload = () => {
  const downloadImage = async () => {
    const grid = document.getElementById('calendar-grid')
    if (!grid) return
    const dataUrl = await toPng(grid, { pixelRatio: 2 })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'calendar.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return <Button onClick={downloadImage}>Download PNG</Button>
}

export default CalendarImageDownload
