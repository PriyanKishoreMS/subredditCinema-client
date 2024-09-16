/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PollsImport } from './routes/polls'
import { Route as AuthCallbackImport } from './routes/auth-callback'
import { Route as IndexImport } from './routes/index'
import { Route as TierlistIndexImport } from './routes/tierlist/index'
import { Route as SurveysIndexImport } from './routes/surveys/index'
import { Route as TierlistTiermakerImport } from './routes/tierlist/tiermaker'
import { Route as TierlistTierlistIdImport } from './routes/tierlist/$tierlistId'
import { Route as SurveysSurveyIdImport } from './routes/surveys/$surveyId'

// Create/Update Routes

const PollsRoute = PollsImport.update({
  path: '/polls',
  getParentRoute: () => rootRoute,
} as any)

const AuthCallbackRoute = AuthCallbackImport.update({
  path: '/auth-callback',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TierlistIndexRoute = TierlistIndexImport.update({
  path: '/tierlist/',
  getParentRoute: () => rootRoute,
} as any)

const SurveysIndexRoute = SurveysIndexImport.update({
  path: '/surveys/',
  getParentRoute: () => rootRoute,
} as any)

const TierlistTiermakerRoute = TierlistTiermakerImport.update({
  path: '/tierlist/tiermaker',
  getParentRoute: () => rootRoute,
} as any)

const TierlistTierlistIdRoute = TierlistTierlistIdImport.update({
  path: '/tierlist/$tierlistId',
  getParentRoute: () => rootRoute,
} as any)

const SurveysSurveyIdRoute = SurveysSurveyIdImport.update({
  path: '/surveys/$surveyId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth-callback': {
      id: '/auth-callback'
      path: '/auth-callback'
      fullPath: '/auth-callback'
      preLoaderRoute: typeof AuthCallbackImport
      parentRoute: typeof rootRoute
    }
    '/polls': {
      id: '/polls'
      path: '/polls'
      fullPath: '/polls'
      preLoaderRoute: typeof PollsImport
      parentRoute: typeof rootRoute
    }
    '/surveys/$surveyId': {
      id: '/surveys/$surveyId'
      path: '/surveys/$surveyId'
      fullPath: '/surveys/$surveyId'
      preLoaderRoute: typeof SurveysSurveyIdImport
      parentRoute: typeof rootRoute
    }
    '/tierlist/$tierlistId': {
      id: '/tierlist/$tierlistId'
      path: '/tierlist/$tierlistId'
      fullPath: '/tierlist/$tierlistId'
      preLoaderRoute: typeof TierlistTierlistIdImport
      parentRoute: typeof rootRoute
    }
    '/tierlist/tiermaker': {
      id: '/tierlist/tiermaker'
      path: '/tierlist/tiermaker'
      fullPath: '/tierlist/tiermaker'
      preLoaderRoute: typeof TierlistTiermakerImport
      parentRoute: typeof rootRoute
    }
    '/surveys/': {
      id: '/surveys/'
      path: '/surveys'
      fullPath: '/surveys'
      preLoaderRoute: typeof SurveysIndexImport
      parentRoute: typeof rootRoute
    }
    '/tierlist/': {
      id: '/tierlist/'
      path: '/tierlist'
      fullPath: '/tierlist'
      preLoaderRoute: typeof TierlistIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AuthCallbackRoute,
  PollsRoute,
  SurveysSurveyIdRoute,
  TierlistTierlistIdRoute,
  TierlistTiermakerRoute,
  SurveysIndexRoute,
  TierlistIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth-callback",
        "/polls",
        "/surveys/$surveyId",
        "/tierlist/$tierlistId",
        "/tierlist/tiermaker",
        "/surveys/",
        "/tierlist/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth-callback": {
      "filePath": "auth-callback.tsx"
    },
    "/polls": {
      "filePath": "polls.tsx"
    },
    "/surveys/$surveyId": {
      "filePath": "surveys/$surveyId.tsx"
    },
    "/tierlist/$tierlistId": {
      "filePath": "tierlist/$tierlistId.tsx"
    },
    "/tierlist/tiermaker": {
      "filePath": "tierlist/tiermaker.tsx"
    },
    "/surveys/": {
      "filePath": "surveys/index.tsx"
    },
    "/tierlist/": {
      "filePath": "tierlist/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
