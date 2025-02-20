import { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeoLocationState{
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeoLocation(){
    const [locationData, setLocationData] =  useState<GeoLocationState>({
        coordinates: null,
        error: null,
        isLoading: true
    });

    const getLocation = () =>{
        setLocationData((prev) => ({...prev, isLoading:true, error:null}));

        if(!navigator.geolocation){
            setLocationData({
                coordinates: null,
                error: "Location is not accessed by browser",
                isLoading: false
            });
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
                setLocationData({
                    coordinates: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    },
                    error: null,
                    isLoading: false
                });
        }, (e)=>{
            let errMessage:string;
            switch(e.code){
                case e.PERMISSION_DENIED:
                    errMessage = "Location permison denied. Please enable location access."
                    break;
                case e.POSITION_UNAVAILABLE:
                    errMessage = "Location information is unavaialble.";
                    break;
                case e.TIMEOUT:
                    errMessage = "Location request timed out.";
                    break;
                default:
                    errMessage = "An unknown error occured. Please try again";
            }
            setLocationData({
                coordinates: null,
                error: errMessage,
                isLoading: false
            })
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    };

    useEffect(()=>{
        getLocation();
    }, []);

    return {
        ...locationData,
        getLocation,
    };
    
}