import { PagesEnum } from "../constants/PageEnums"

export type DefaultProps ={
    currentPage: PagesEnum
    setCurrentPage: React.Dispatch<React.SetStateAction<PagesEnum>> 
}