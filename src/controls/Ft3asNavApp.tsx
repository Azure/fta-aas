import { INavLink, INavLinkGroup, Nav, Stack } from "@fluentui/react";
import { BrowserRouter, Link, Route, Switch, useHistory } from "react-router-dom";
import TelemetryProvider from "../service/telemetry-provider";
import { getAppInsights } from "../service/TelemetryService";
import Ft3asApp from "./Ft3asApp";
import Ft3asHome from "./Ft3asHome";
import React from "react";


function RedirectToHome() {
    const history = useHistory();
    React.useEffect(() => {
      history.push('/');
    }, []);
    return <></>
}
export default function Ft3asNavApp() {
    const appInsightKey = process.env.REACT_APP_APP_INSIGHTS_KEY
    let appInsights = null;
    const history = useHistory();

    const _onLinkClick = ( item?: INavLink) => {
        if (item) {
            if(item.key==='alz'){
                window.sessionStorage.setItem('currentChecklist','alz');
            }
            if(window.location.pathname === item.url){
                console.log('yesss' , window.location.pathname , item.url)

            }
            if(history){
                history.push(item.url);
            }
            
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
                    url: '/checklist',
                    icon: 'CheckList',
                    key: 'key1',

                },
                {
                    name: 'Azure Landing Zone Review',
                    url: '/checklist',
                    icon: 'CheckList',
                    key: 'alz',
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
                            //onLinkClick={_onLinkClick}
                            selectedKey="key3"
                            ariaLabel="FTA as a Service"
                            groups={navLinkGroups}
                            onRenderLink={(link) => link ? (<a onClick={()=>_onLinkClick(link)} >{link.name}</a>) : <></>}
                        />
                    </Stack.Item>
                    <Stack.Item grow>
                        <Switch>
                            <Route exact path="/checklist" component={Ft3asApp} />
                            <Route exact path="/" component={Ft3asHome} />
                            <Route path="*" component={RedirectToHome} />
                        </Switch>
                    </Stack.Item>
                </Stack>
            </TelemetryProvider>
        </BrowserRouter >);
}