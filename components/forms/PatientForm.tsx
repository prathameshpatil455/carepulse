"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { addPatient, createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { GenderOptions, rooms } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      aadhar_number: "",
      gender: "Female",
      room: "",
      patientHistory: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      console.log(values, "this is values");
      const newPatient = await addPatient(values);

      console.log(newPatient, "newPatient");
      if (newPatient) {
        router.push(`/patients/${newPatient.$id}/register`);
      }
    } catch (error) {
      console.log(error, "error");
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4 flex gap-6 items-center">
          <Image
            src="/assets/images/madilu_icon.jpg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-14 w-fit rounded"
          />
          <div className="flex flex-col pb-4">
            <h1 className="header text-[#fff]">Madilu</h1>
            <p className="text-dark-700">Get started with new patients.</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Patient Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="aadhar_number"
          label="Aadhar No"
          placeholder="XXXXXXXXXXXX"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="helloworld@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="XXXXXXXXXX"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="gender"
          label="Gender"
          renderSkeleton={(field) => (
            <FormControl>
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {GenderOptions.map((option, i) => (
                  <div key={option + i} className="radio-group">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="patientHistory"
          label="Patient History"
          placeholder="PNC, followUp, etc."
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="room"
          label="Room No"
          placeholder="Select room no"
        >
          {rooms.map((room, i) => (
            <SelectItem key={room.id + i} value={room.name}>
              <div className="flex cursor-pointer items-center gap-2">
                {/* <Image
                  src={room.image}
                  width={32}
                  height={32}
                  alt="room"
                  className="rounded-full border border-dark-500"
                /> */}
                <p>{room.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
