/* tslint:disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreatePredictionInput = {
  id?: string | null;
  label: string;
  count: number;
  queryPredictionsPredictionsId?: string | null;
};

export type UpdatePredictionInput = {
  id: string;
  label?: string | null;
  count?: number | null;
  queryPredictionsPredictionsId?: string | null;
};

export type DeletePredictionInput = {
  id?: string | null;
};

export type CreateQueryPredictionsInput = {
  id?: string | null;
};

export type UpdateQueryPredictionsInput = {
  id: string;
};

export type DeleteQueryPredictionsInput = {
  id?: string | null;
};

export type ModelPredictionFilterInput = {
  id?: ModelIDFilterInput | null;
  label?: ModelStringFilterInput | null;
  count?: ModelIntFilterInput | null;
  and?: Array<ModelPredictionFilterInput | null> | null;
  or?: Array<ModelPredictionFilterInput | null> | null;
  not?: ModelPredictionFilterInput | null;
};

export type ModelIDFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelIntFilterInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  contains?: number | null;
  notContains?: number | null;
  between?: Array<number | null> | null;
};

export type ModelQueryPredictionsFilterInput = {
  id?: ModelIDFilterInput | null;
  and?: Array<ModelQueryPredictionsFilterInput | null> | null;
  or?: Array<ModelQueryPredictionsFilterInput | null> | null;
  not?: ModelQueryPredictionsFilterInput | null;
};

export type CreatePredictionMutation = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type UpdatePredictionMutation = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type DeletePredictionMutation = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type CreateQueryPredictionsMutation = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type UpdateQueryPredictionsMutation = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type DeleteQueryPredictionsMutation = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type GetPredictionQuery = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type ListPredictionsQuery = {
  __typename: "ModelPredictionConnection";
  items: Array<{
    __typename: "Prediction";
    id: string;
    label: string;
    count: number;
  } | null> | null;
  nextToken: string | null;
};

export type GetQueryPredictionsQuery = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type ListQueryPredictionssQuery = {
  __typename: "ModelQueryPredictionsConnection";
  items: Array<{
    __typename: "QueryPredictions";
    id: string;
  } | null> | null;
  nextToken: string | null;
};

export type OnCreatePredictionSubscription = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type OnUpdatePredictionSubscription = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type OnDeletePredictionSubscription = {
  __typename: "Prediction";
  id: string;
  label: string;
  count: number;
};

export type OnCreateQueryPredictionsSubscription = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type OnUpdateQueryPredictionsSubscription = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

export type OnDeleteQueryPredictionsSubscription = {
  __typename: "QueryPredictions";
  id: string;
  predictions: {
    __typename: "ModelPredictionConnection";
    nextToken: string | null;
  } | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreatePrediction(
    input: CreatePredictionInput
  ): Promise<CreatePredictionMutation> {
    const statement = `mutation CreatePrediction($input: CreatePredictionInput!) {
        createPrediction(input: $input) {
          __typename
          id
          label
          count
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreatePredictionMutation>response.data.createPrediction;
  }
  async UpdatePrediction(
    input: UpdatePredictionInput
  ): Promise<UpdatePredictionMutation> {
    const statement = `mutation UpdatePrediction($input: UpdatePredictionInput!) {
        updatePrediction(input: $input) {
          __typename
          id
          label
          count
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdatePredictionMutation>response.data.updatePrediction;
  }
  async DeletePrediction(
    input: DeletePredictionInput
  ): Promise<DeletePredictionMutation> {
    const statement = `mutation DeletePrediction($input: DeletePredictionInput!) {
        deletePrediction(input: $input) {
          __typename
          id
          label
          count
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeletePredictionMutation>response.data.deletePrediction;
  }
  async CreateQueryPredictions(
    input: CreateQueryPredictionsInput
  ): Promise<CreateQueryPredictionsMutation> {
    const statement = `mutation CreateQueryPredictions($input: CreateQueryPredictionsInput!) {
        createQueryPredictions(input: $input) {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateQueryPredictionsMutation>response.data.createQueryPredictions;
  }
  async UpdateQueryPredictions(
    input: UpdateQueryPredictionsInput
  ): Promise<UpdateQueryPredictionsMutation> {
    const statement = `mutation UpdateQueryPredictions($input: UpdateQueryPredictionsInput!) {
        updateQueryPredictions(input: $input) {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateQueryPredictionsMutation>response.data.updateQueryPredictions;
  }
  async DeleteQueryPredictions(
    input: DeleteQueryPredictionsInput
  ): Promise<DeleteQueryPredictionsMutation> {
    const statement = `mutation DeleteQueryPredictions($input: DeleteQueryPredictionsInput!) {
        deleteQueryPredictions(input: $input) {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteQueryPredictionsMutation>response.data.deleteQueryPredictions;
  }
  async GetPrediction(id: string): Promise<GetPredictionQuery> {
    const statement = `query GetPrediction($id: ID!) {
        getPrediction(id: $id) {
          __typename
          id
          label
          count
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetPredictionQuery>response.data.getPrediction;
  }
  async ListPredictions(
    filter?: ModelPredictionFilterInput,
    limit = 9999,
    nextToken?: string
  ): Promise<ListPredictionsQuery> {
    const statement = `query ListPredictions($filter: ModelPredictionFilterInput, $limit: Int, $nextToken: String) {
        listPredictions(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            label
            count
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListPredictionsQuery>response.data.listPredictions;
  }
  async GetQueryPredictions(id: string): Promise<GetQueryPredictionsQuery> {
    const statement = `query GetQueryPredictions($id: ID!) {
        getQueryPredictions(id: $id) {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetQueryPredictionsQuery>response.data.getQueryPredictions;
  }
  async ListQueryPredictionss(
    filter?: ModelQueryPredictionsFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListQueryPredictionssQuery> {
    const statement = `query ListQueryPredictionss($filter: ModelQueryPredictionsFilterInput, $limit: Int, $nextToken: String) {
        listQueryPredictionss(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListQueryPredictionssQuery>response.data.listQueryPredictionss;
  }
  OnCreatePredictionListener: Observable<
    OnCreatePredictionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreatePrediction {
        onCreatePrediction {
          __typename
          id
          label
          count
        }
      }`
    )
  ) as Observable<OnCreatePredictionSubscription>;

  OnUpdatePredictionListener: Observable<
    OnUpdatePredictionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdatePrediction {
        onUpdatePrediction {
          __typename
          id
          label
          count
        }
      }`
    )
  ) as Observable<OnUpdatePredictionSubscription>;

  OnDeletePredictionListener: Observable<
    OnDeletePredictionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeletePrediction {
        onDeletePrediction {
          __typename
          id
          label
          count
        }
      }`
    )
  ) as Observable<OnDeletePredictionSubscription>;

  OnCreateQueryPredictionsListener: Observable<
    OnCreateQueryPredictionsSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateQueryPredictions {
        onCreateQueryPredictions {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnCreateQueryPredictionsSubscription>;

  OnUpdateQueryPredictionsListener: Observable<
    OnUpdateQueryPredictionsSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateQueryPredictions {
        onUpdateQueryPredictions {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnUpdateQueryPredictionsSubscription>;

  OnDeleteQueryPredictionsListener: Observable<
    OnDeleteQueryPredictionsSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteQueryPredictions {
        onDeleteQueryPredictions {
          __typename
          id
          predictions {
            __typename
            nextToken
          }
        }
      }`
    )
  ) as Observable<OnDeleteQueryPredictionsSubscription>;
}
