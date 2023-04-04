import { INavLinkGroup, Nav, Stack } from "@fluentui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import TelemetryProvider from "../service/telemetry-provider";
import { getAppInsights } from "../service/TelemetryService";
import Ft3asApp from "./Ft3asApp";
import Ft3asHome from "./Ft3asHome";

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
                key: 'key1'
            }
        ],
    },
];

export default function Ft3asNavApp() {
    const appInsightKey = process.env.REACT_APP_APP_INSIGHTS_KEY
    let appInsights = null;

    return (

        <BrowserRouter>
            <TelemetryProvider instrumentationKey={appInsightKey} after={() => { appInsights = getAppInsights() }}>
                <Stack horizontal>
                    <Stack.Item>
                        <Nav
                            selectedKey="key3"
                            ariaLabel="FTA as a Service"
                            groups={navLinkGroups}
                        />
                    </Stack.Item>
                    <Stack.Item grow>
                        <Switch>
                            <Route path="/checklist" component={Ft3asApp} />
                            <Route path="/" component={Ft3asHome} />
                        </Switch>
                    </Stack.Item>
                </Stack>
            </TelemetryProvider>
        </BrowserRouter >);
}