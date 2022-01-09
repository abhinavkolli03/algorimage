import React from 'react';
import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink} from './NavBarElements.js';

const Navbar = () => {
    return (
        <Nav>
            <NavLink to="/">
                <h1>Logo</h1>
            </NavLink>
            <Bars />
            <NavMenu>
                <NavLink to="/pathfinder" sctiveStyle>
                    Pathfinder
                </NavLink>
                <NavLink to="/sorter" sctiveStyle>
                    Sorter
                </NavLink>
                <NavLink to="/other-AI" sctiveStyle>
                    Other AI
                </NavLink>
                <NavLink to="/Blog" sctiveStyle>
                    Blog
                </NavLink>
            </NavMenu>
            <NavBtn>
                <NavBtnLink to="/signin">Sign In</NavBtnLink>
            </NavBtn>
        </Nav>
    )
}

export default Navbar;