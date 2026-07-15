import { CountriesControllers } from "@/app/api/countriesControllers";
import { useEffect, useState } from "react";

export const useCountries = ({
  status,
  page,
  limit,
  search,
}: {
  status: boolean;
  page: number;
  limit: number;
  search: string;
}) => {
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    setCountryLoading(true);
    CountriesControllers.getAllCountries(page, limit, search, status)
      .then((res) => {
        // console.log("res", res);
        setCountryData(res.data.data);
        setCountryLoading(false);
      })
      .catch((err) => {
        setCountryLoading(false);
        console.log("error in get countries", err);
      });
  }, [status, page, limit, search]);
  return { countryData, countryLoading };
};
