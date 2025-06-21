import { TextInputProps, TouchableOpacityProps } from "react-native";

export type Category = "Books" | "Museums" | "Library" | "Cinema";


export declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

export declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

export interface Offer {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  dateStart: Date;
  createdBy?: string; // ObjectId reference to Partner
  views?: number;
  reservation?: number;
  categories: Category; // Note: backend stores as single string, not array
  createdAt?: Date;
  updatedAt?: Date;
}
