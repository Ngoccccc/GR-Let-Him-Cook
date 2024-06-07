import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import ChefLayout from "../Layout/Chef/Layout";
import apiURL from "../../instances/axiosConfig";

export default function ChefRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`${apiURL}/api/v1/auth/chef-auth`);
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? (
    <ChefLayout>
      <Outlet />
    </ChefLayout>
  ) : (
    <Spinner />
  );
}
