import React, { createContext } from "react";
import { ErrorHandler } from "@/helpers/ErrorHandler.tsx";
import useToastHelper from "@/helpers/useToastHelper.tsx";
import { handleFetch } from "@/api/axios";
import { useNavigate } from "react-router-dom";
import {Prof} from "@/types/prof.ts";


type ProfsContextType = {
    createProf: (prof: Prof) => void;
    updateProf: (prof: Prof, profId: number) => void;
    deleteProf: (profId: number) => void;
    getProf: (profId: number) => Promise<Prof>;
    getProfs: () => Promise<Prof[]>;
};

type Props = { children: React.ReactNode };

const ProfsContext = createContext<ProfsContextType>({} as ProfsContextType);

export const ProfsProvider = ({ children }: Props) => {
    const { showToast } = useToastHelper();
    const navigate = useNavigate();

    const createProf = async (prof: Prof) => {
        const formData = new FormData();
        formData.append("firstName", prof.firstName);
        formData.append("lastName", prof.lastName);
        formData.append("password", prof.password);
        formData.append("email", prof.email);
        //formData.append("filiere", prof.filiere);
        //formData.append("departement", prof.departement);

        try {
            const res = await handleFetch("Professors/add", "POST", formData);
            if(res)
                assignDepartementFiliere(res.data.id,prof.filiere,prof.departement);
            showToast("Success", "Created Successufuly");
            // navigate(`/Professors/${res.data.id}`);
            navigate(`/admin/profs`);
        } catch (e) {
            const errorMessage = ErrorHandler(e);
            showToast("Something went wrong!", errorMessage);
        }
    };
    const assignDepartementFiliere=async(id:number,filiere:string,departement:string)=>{
        const formData = new FormData();
        formData.append("filiere", filiere);
        formData.append("departement", departement);
        try {
            await handleFetch(`Professors/${id}/filiere/${filiere}/departement/${departement}`, "POST", formData);
            showToast("Success", "Assign Successufuly");
        } catch (e) {
            const errorMessage = ErrorHandler(e);
            showToast("Something went wrong!", errorMessage);
        }
    }
   // const updateProf = async (prof: Prof, profId: number) => {
   //      const formData = new FormData();
   //      formData.append("firstName", prof.firstName);
   //      formData.append("lastName", prof.lastName);
   //      formData.append("password", prof.password);
   //      formData.append("email", prof.email);
   //      // formData.append("group", prof.group);
   //      formData.append("filiere", prof.filiere);
   //      formData.append("departement", prof.departement);
   //      // formData.append("enabled", prof.enabled.toString());
   //      // formData.append("accountNonExpired", prof.accountNonExpired.toString());
   //      // formData.append("credentialsNonExpired", prof.credentialsNonExpired.toString());
   //
   //      try {
   //          const res = await handleFetch(`Professors/update/${profId}`, "PUT", formData);
   //          showToast("Success", "Updated Successufuly");
   //          navigate(`/Professors/${res.data.id}`);
   //      } catch (e) {
   //          const errorMessage = ErrorHandler(e);
   //          showToast("Something went wrong!", errorMessage);
   //      }
   //  };

    const updateProf = async (prof: Prof, profId: number) => {
        const formData = new FormData();
        formData.append("firstName", prof.firstName);
        formData.append("lastName", prof.lastName);
        formData.append("password", prof.password);
        formData.append("email", prof.email);

        try {
            const res = await handleFetch(`Professors/update/${profId}`, "PUT", formData);
            if (res) {
                await updateDepartementFiliere(profId, prof.filiere, prof.departement);
            }
            showToast("Success", "Updated Successfully");
            // navigate(`/admin/profs/${res.data.id}`);
            navigate(`/admin/profs/`);
        } catch (e) {
            const errorMessage = ErrorHandler(e);
            showToast("Something went wrong!", errorMessage);
        }
    };

    const updateDepartementFiliere = async (id: number, filiere: string, departement: string) => {
        const formData = new FormData();
        formData.append("filiere", filiere);
        formData.append("departement", departement);

        try {
            await handleFetch(`Professors/${id}/filiere/${filiere}/departement/${departement}`, "POST", formData);
            showToast("Success", "Assign Successfully");
        } catch (e) {
            const errorMessage = ErrorHandler(e);
            showToast("Something went wrong!", errorMessage);
        }
    };

    const deleteProf = async (profId: number) => {
        try {
            await handleFetch(`Professors/delete/${profId}`, "DELETE");
            showToast("Success", "Deleted Successufuly");
            navigate(`/admin/profs`);
        } catch (e) {
            const errorMessage = ErrorHandler(e);
            showToast("Something went wrong!", errorMessage);
        }
    };

    const getProf = async (profId: number): Promise<Prof> => {
        try {
            const response = await handleFetch(`Professors/${profId}`, "GET");
            
            return response.data || {};
        } catch (error) {
            const errorMessage = ErrorHandler(error);
            showToast("Something went wrong!", errorMessage);
            throw error;
        }
    };

    const getProfs = async (): Promise<Prof[]> => {
        try {
            const response = await handleFetch(`Professors/List`, "GET");
            return response.data;
        } catch (error) {
            const errorMessage = ErrorHandler(error);
            showToast("Something went wrong!", errorMessage);
            throw error;
        }
    };

    return (
        <ProfsContext.Provider
            value={{
                createProf,
                updateProf,
                deleteProf,
                getProf,
                getProfs,
            }}
        >
            {children}
        </ProfsContext.Provider>
    );
};

export const useProfs = (): ProfsContextType => React.useContext(ProfsContext);
