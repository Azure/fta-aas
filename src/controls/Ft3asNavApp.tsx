import { INavLink, INavLinkGroup, Nav, Panel, Stack, StackItem } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Ft3asApp from "./Ft3asApp";
import Ft3asHome from "./Ft3asHome";

function _onLinkClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
    // if (item) {
    //     history.
    // }
}

const navLinkGroups: INavLinkGroup[] = [
    {
        links: [
            {
                name: 'Home',
                url: '/',
                icon: 'Home',
                expandAriaLabel: 'Home',
                collapseAriaLabel: 'Home',
            },
            {
                name: 'Checklists',
                url: 'checklist',
                icon: 'CheckList',
                key: 'key1'
            }
        ],
    },
];

export default function Ft3asNavApp() {
    return (
        <BrowserRouter>
            <Stack horizontal>
                <Stack.Item>
                    <Nav
                        // onLinkClick={_onLinkClick}
                        selectedKey="key3"
                        ariaLabel="FTA as a Service"
                        groups={navLinkGroups}
                    />
                </Stack.Item>
                <Stack.Item>
                    <Switch>
                        <Route path="/checklist" component={Ft3asApp} />
                        <Route path="/" component={Ft3asHome} />
                    </Switch>
                </Stack.Item>
            </Stack>
        </BrowserRouter >);
}