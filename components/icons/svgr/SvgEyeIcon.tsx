import * as React from 'react';

interface SvgEyeIconProps {
  eyeOpen: boolean,
  width: number,
  height: number
}

const SvgEyeIcon = ({ eyeOpen, width=22, height=22 }:SvgEyeIconProps) => {
  if (!eyeOpen) return (
    <svg width={`${width}`} height={`${height}`} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.55249 4.48853L19.3025 16.7385" stroke="#8D8D8D" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.347 12.1148C12.8665 12.7297 12.1181 13.1249 11.2773 13.1249C9.82756 13.1249 8.65234 11.9497 8.65234 10.4999C8.65234 9.90982 8.84706 9.36522 9.17574 8.92676" stroke="#8D8D8D"/>
      <path d="M8.65234 4.92334C10.9101 3.89657 13.6633 4.31178 15.5205 6.16897L18.1471 8.7955C18.5816 9.23003 18.7988 9.44729 18.9215 9.67794C19.195 10.1919 19.195 10.8081 18.9215 11.3221C18.7988 11.5527 18.5816 11.77 18.1471 12.2045L18.1015 12.25" stroke="#8D8D8D" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.59759 7.57935L3.95944 9.41011C3.39054 10.0459 3.27664 10.9795 3.75519 11.6857C5.92691 14.891 9.78719 18.0396 15.4955 15.5739" stroke="#8D8D8D" stroke-linecap="round"/>
    </svg>
  )

  return (
    <svg width={`${width}`} height={`${height}`} viewBox={`0 0 ${width} ${height}`}  fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5273 11C14.5273 12.5188 13.2962 13.75 11.7773 13.75C10.2585 13.75 9.02734 12.5188 9.02734 11C9.02734 9.48117 10.2585 8.25 11.7773 8.25C13.2962 8.25 14.5273 9.48117 14.5273 11Z" stroke="#4987BD"/>
      <path d="M7.14799 6.46265C9.65386 3.95679 13.7167 3.95679 16.2225 6.46265L18.1671 8.40719C19.3893 9.62941 20.0004 10.2406 20.0004 10.9999C20.0004 11.7593 19.3893 12.3704 18.1671 13.5926L16.2225 15.5371C13.7167 18.043 9.65386 18.043 7.14799 15.5371L5.20345 13.5926C3.98122 12.3704 3.37012 11.7593 3.37012 10.9999C3.37012 10.2406 3.98122 9.62941 5.20345 8.40719L7.14799 6.46265Z" stroke="#4987BD" stroke-linejoin="round"/>
    </svg>
  )
}

export default SvgEyeIcon;
