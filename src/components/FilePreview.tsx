"use client";

import DeleteIcon from "components/icons/DeleteIcon";
import { Button } from "components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { BsFiletypePng } from "react-icons/bs";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { BsFiletypeSvg } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import { getFileExtension } from "utils/get-file-extension";
import Link from "next/link";
import ConfirmationDialog from "./ConfirmationDialog";
// import ConfirmationDialog from "components/ConfirmationDialog";

const FILE_TYPE_ICONS = {
  png: BsFiletypePng,

  jpeg: BsFiletypeJpg,
  jpg: BsFiletypeJpg,
  svg: BsFiletypeSvg,

  pdf: BsFiletypePdf,
  doc: BsFiletypeDoc,
  docx: BsFiletypeDocx,

  csv: BsFiletypeCsv,
  xls: BsFiletypeXls,
  xlsx: BsFiletypeXlsx,
};

type TProps = {
  id?: string;
  file: string;
  name: string;
  showDeleteIcon?: boolean;
  timestamp: string;
  isLoading?: boolean;
  onDeleteDocument?: (id: string) => void;
};

export default function FilePreview({
  id,
  file,
  name,
  timestamp,
  showDeleteIcon,
  isLoading,
  onDeleteDocument,
}: TProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const type = getFileExtension(file);

  const Icon = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS];

  const onDelete = () => {
    if (onDeleteDocument) {
      onDeleteDocument(id ?? "");
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit '>
        <div className='flex items-center justify-between gap-2 mb-2'>
          <div className='flex items-center gap-2'>
            <h2 className='line-clamp-1'>{name}</h2>
          </div>

          {showDeleteIcon && (
            <Button
              type='button'
              onClick={() => setDialogOpen(true)}
              variant='outline'
              size='icon'
            >
              <DeleteIcon />
            </Button>
          )}
        </div>
        <Link href={file} target='_blank' title={file}>
          <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
            {Icon && <Icon size={100} />}
          </div>
        </Link>
        <h6 className='text-sm'>
          Created At: <span>{format(timestamp, "MMM dd, yyy")}</span>
        </h6>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this file?'
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
        loading={isLoading}
      />
    </>
  );
}
