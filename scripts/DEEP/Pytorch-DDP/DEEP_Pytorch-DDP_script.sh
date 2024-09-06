#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%
#SBATCH --gpus-per-node=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=12
#SBATCH --exclusive
#SBATCH --gres=gpu:1

#MODULES BEGIN DEEP Pytorch-DDP
ml Stages/2024 GCC OpenMPI CUDA/12 cuDNN MPI-settings/CUDA
ml Python CMake HDF5 PnetCDF libaio mpi4py
#MODULES END

# variables for specific HPC
export CUDA_VISIBLE_DEVICES="0"
ln -sf /usr/lib64/libcuda.so.1
ln -sf /usr/lib64/libnvidia-ml.so.1
export LD_LIBRARY_PATH=.:/usr/local/cuda-11.7/lib64:$LD_LIBRARY_PATH

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
