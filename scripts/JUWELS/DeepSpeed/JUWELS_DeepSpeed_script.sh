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

#MODULES BEGIN JUWELS DeepSpeed
ml GCC OpenMPI CUDA/12 MPI-settings/CUDA Python HDF5 PnetCDF libaio mpi4py
#MODULES END

# variables for specific HPC
export CUDA_VISIBLE_DEVICES="0,1,2,3"

source your/env_path/bin/activate

# DeepSpeed NCCL/MPI setup
export MASTER_ADDR=$(scontrol show hostnames "\$SLURM_JOB_NODELIST" | head -n 1)i 
export MASTER_PORT=29500 
srun --cpu-bind=none python %executable% --deepspeed
