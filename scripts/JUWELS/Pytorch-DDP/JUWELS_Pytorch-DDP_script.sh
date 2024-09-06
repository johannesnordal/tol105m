#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%
#SBATCH --gpus-per-node=4
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=48
#SBATCH --exclusive
#SBATCH --gres=gpu:4

#MODULES BEGIN JUWELS Pytorch-DDP
ml GCC OpenMPI CUDA/12 MPI-settings/CUDA Python HDF5 PnetCDF libaio mpi4py
#MODULES END

# variables for specific HPC
export CUDA_VISIBLE_DEVICES="0,1,2,3"

source your/env_path/bin/activate

 # DDP NCCL setup
srun --cpu-bind=none bash -c "torchrun \
  --log_dir='logs' \
  --nnodes=$SLURM_NNODES \
  --nproc_per_node=$SLURM_GPUS_PER_NODE \
  --rdzv_id=$SLURM_JOB_ID \
  --rdzv_backend=c10d  \
  --rdzv_endpoint='$(scontrol show hostnames "$SLURM_JOB_NODELIST" | head -n 1)'i:29500 \
  --rdzv_conf=is_host=\$(((SLURM_NODEID)) && echo 0 || echo 1) \
%executable%"
