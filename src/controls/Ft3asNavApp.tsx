import { INavLink, INavLinkGroup, Nav, Stack } from "@fluentui/react";
import { BrowserRouter, Link, Route, Switch, useHistory } from "react-router-dom";
import TelemetryProvider from "../service/telemetry-provider";
import { getAppInsights } from "../service/TelemetryService";
import Ft3asApp from "./Ft3asApp";
import Ft3asHome from "./Ft3asHome";



export default function Ft3asNavApp() {
    const appInsightKey = process.env.REACT_APP_APP_INSIGHTS_KEY
    let appInsights = null;
    const history = useHistory();

    const _onLinkClick = (event?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
        if (item) {
            history.push(item.url);
            return false;
            // console.log('navigate to ' + item.url);
            // event?.stopPropagation();            
        }
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
                    name: 'Azure Design Review',
                    url: 'checklist',
                    icon: 'CheckList',
                    key: 'key1',

                }
            ],
        },
    ];

    return (

        <BrowserRouter>
            <TelemetryProvider instrumentationKey={appInsightKey} after={() => { appInsights = getAppInsights() }}>
                <Stack horizontal>
                    <Stack.Item>
                        <Nav
                            onLinkClick={_onLinkClick}
                            selectedKey="key3"
                            ariaLabel="FTA as a Service"
                            groups={navLinkGroups}
                            onRenderLink={(link) => link ? (<Link to={link.url}>{link.name}</Link>) : <></>}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <Switch>
                            <Route path="/checklist" component={Ft3asApp} />
                            <Route path="/" component={Ft3asHome} />
                        </Switch>
                    </Stack.Item>
                </Stack>
            </TelemetryProvider>
        </BrowserRouter >);
}