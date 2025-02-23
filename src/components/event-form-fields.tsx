import { Controller, useFormContext } from "react-hook-form";

import Image from "next/image";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toBase64 } from "@/utils/file";

export function EventFormFields() {
  const { control, watch } = useFormContext();
  const previewImage = watch("banner");

  return (
    <div className="grid w-full items-center gap-4">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter the title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter the description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter the location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Controller
        control={control}
        name="banner"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel>Banner Image URL</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                {...rest}
                onChange={async (event) => {
                  const files = event.target.files;
                  if (!files) {
                    return;
                  }
                  const fileBase64 = await toBase64(files[0]);
                  onChange(fileBase64);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {previewImage && (
        <div className="relative h-64 w-full">
          <Image src={previewImage} alt="Banner Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
