import { Publication } from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";

const useItem = (type: string) => {
    const [itemLoading, setItemLoading] = useState<boolean>(false);
    const [itemData, setItemData] = useState<Publication>();


    const getItemData = async () => {
        setItemLoading(true)
        try {

        } catch (err: any) {
            console.error(err.message)
        }
        setItemLoading(false)
    }

    const getProfile = async () => {
        try {

        } catch (err: any) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if (type) {
            getItemData();
        }
    }, [])
    
    return {
        itemLoading,
        itemData
    }
}

export default useItem;