import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { SvgProps } from "react-native-svg"

const Fence: React.FC<SvgProps> = (props) => (
    <Svg
        width={335}
        height={104}
        viewBox="0 0 335 104"
        fill="none"
        {...props}
    >
        <Path fill="#956045" d="M0 32h335v18H0z" />
        <Path stroke="#82533B" strokeWidth={2} d="M1 33h333v16H1z" />
        <Path fill="#946045" d="M0 65h335v18H0z" />
        <Path stroke="#82533B" strokeWidth={2} d="M1 66h333v16H1z" />
        <Path fill="#956045" d="M14 10.445 33 0l19 10.445V104H14V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M51 11.036V103H15V11.036l18-9.895 18 9.895Z" />
        <Path fill="#956045" d="M68 10.445 87 0l19 10.445V104H68V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M105 11.036V103H69V11.036l18-9.895 18 9.895Z" />
        <Path fill="#956045" d="M122 10.445 141 0l19 10.445V104h-38V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M159 11.036V103h-36V11.036l18-9.895 18 9.895Z" />
        <Path fill="#956045" d="M176 10.445 195 0l19 10.445V104h-38V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M213 11.036V103h-36V11.036l18-9.895 18 9.895Z" />
        <Path fill="#956045" d="M230 10.445 249 0l19 10.445V104h-38V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M267 11.036V103h-36V11.036l18-9.895 18 9.895Z" />
        <Path fill="#956045" d="M284 10.445 303 0l19 10.445V104h-38V10.445Z" />
        <Path stroke="#82533B" strokeWidth={2} d="M321 11.036V103h-36V11.036l18-9.895 18 9.895Z" />
    </Svg>
)
export default Fence
