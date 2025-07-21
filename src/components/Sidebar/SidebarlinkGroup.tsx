import { ReactNode, useState } from "react";

interface ISideBarGroups {
    children: (handleClick: () => void, open: boolean) => ReactNode;
    activeCondition: boolean;
}
const SidebarLinkGroup = ({children, activeCondition}: ISideBarGroups) => {
    const [open, setOpen] = useState<boolean>(activeCondition);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <li className="mb-2">{children(handleClick, open)}</li>
    );
};

export default SidebarLinkGroup;