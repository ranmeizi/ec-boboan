import React, { useEffect } from 'react'
import { RouteObject, useNavigate, Outlet } from "react-router-dom";
import TabView from '@/components/TabView'
import { TransitionRoute, KRoute } from "@bomon/expand-router";
import Favorites from "../views/Favorites";
import Nearby from "../views/Nearby";
import Recents from "../views/Recents";

const Redirect = (props: { to: string }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(props.to, { replace: true });
    }, []);
    return <Outlet />;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Redirect to="/t/recents" />,
        children: [
            {
                path: "/t",
                element: <TabView />,
                children: [
                    {
                        path: "/t/favorites",
                        element: (
                            <TransitionRoute>
                                <Favorites />
                            </TransitionRoute>
                        ),
                    },
                    {
                        path: "/t/nearby",
                        element: (
                            <TransitionRoute>
                                <Nearby />
                            </TransitionRoute>
                        ),
                    },
                    {
                        path: "/t/recents",
                        element: (
                            <TransitionRoute cloneNode>
                                <KRoute>
                                    <Recents />
                                </KRoute>
                            </TransitionRoute>
                        ),
                    },
                ],
            },
        ],
    },
];


export default routes
