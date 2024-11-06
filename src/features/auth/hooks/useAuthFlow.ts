import {
  useGetTokenMutation,
  useGetUniqueTokenMutation,
} from "@/app/services/streamlike";
import { useAppDispatch } from "@/app/technical/hooks/useAppDispatch";
import {
  setApiHostname,
  setCredentials,
  setToken,
} from "@/features/auth/state/auth.slice";
import { useCallback } from "react";

export const useAuthFlow = () => {
  const dispatch = useAppDispatch();

  const [
    getUniqueToken,
    { isLoading: isUniqueTokenLoading, isError: isUniqueTokenError },
  ] = useGetUniqueTokenMutation();
  const [getToken, { isLoading: isTokenLoading, isError: isTokenError }] =
    useGetTokenMutation();

  const authenticate = useCallback(
    async (data: { apiHostname: string; login: string; password: string }) =>
      new Promise<void>((resolve, reject) => {
        getUniqueToken(data)
          .unwrap()
          .then(async (response) => {
            if (response.token) {
              dispatch(setToken(response));
              dispatch(setApiHostname(data.apiHostname));

              const responseToken = await getToken().unwrap();
              if (responseToken.token) {
                dispatch(setToken(responseToken));
                dispatch(
                  setCredentials({
                    login: data.login,
                    password: data.password,
                  })
                );
              }
              resolve();
            } else {
              reject();
            }
          })
          .catch((e) => reject(e));
      }),
    []
  );

  return {
    authenticate,
    isLoading: isUniqueTokenLoading || isTokenLoading,
    isError: isUniqueTokenError || isTokenError,
  };
};
