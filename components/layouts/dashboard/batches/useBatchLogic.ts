import { useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { CATEGORY } from "@/utils/enum";
import { Batch, CREATE_BATCH_REQUEST } from "@/utils/type";
import { batchValidationSchema } from "@/utils/validation";
import { useBatches } from "@/hooks/common/useBatches";

export const useBatchLogic = () => {
  const { 
    batches, 
    loading, 
    creating, 
    updating, 
    pagination, 
    createBatch, 
    updateBatch, 
    fetchBatches, 
    goToPage 
  } = useBatches();

  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const formik = useFormik<CREATE_BATCH_REQUEST>({
    initialValues: { 
      name: "", 
      startDate: null as any, 
      endDate: null as any, 
      category: CATEGORY.RESEARCH,
      userRole: "",
      subjectiveQuestions: [],
      objectiveQuestions: [],
    },
    validationSchema: batchValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload: CREATE_BATCH_REQUEST = {
        ...values,
        startDate: values.startDate ? dayjs(values.startDate).toISOString() : "",
        endDate: values.endDate ? dayjs(values.endDate).toISOString() : "",
      };

      let success = false;
      if (selectedBatch) {
        success = await updateBatch(selectedBatch.id, payload);
      } else {
        success = await createBatch(payload);
      }

      if (success) {
        resetForm();
        setOpenDialog(false);
        setSelectedBatch(null);
      }
    },
  });

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    formik.setValues({
      name: batch.name,
      startDate: dayjs(batch.startDate) as any,
      endDate: dayjs(batch.endDate) as any,
      category: batch.category,
      userRole: batch.userRole || "",
      subjectiveQuestions: (batch as any).subjectiveQuestions || [],
      objectiveQuestions: (batch as any).objectiveQuestions || [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBatch(null);
    formik.resetForm();
  };

  const handleCreateOpen = () => {
    setSelectedBatch(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  return {
    batches,
    loading,
    creating,
    updating,
    pagination,
    search,
    setSearch,
    openDialog,
    selectedBatch,
    formik,
    fetchBatches,
    goToPage,
    handleEdit,
    handleCloseDialog,
    handleCreateOpen,
  };
};
