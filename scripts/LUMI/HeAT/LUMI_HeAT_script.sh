#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%
#SBATCH --gpus-per-node=8
#SBATCH --ntasks-per-node=8
#SBATCH --cpus-per-task=8
#SBATCH --exclusive
#SBATCH --gres=gpu:8

#MODULES BEGIN LUMI HeAT
ml LUMI/22.08 partition/G rocm ModulePowerUser/LUMI buildtools cray-python
#MODULES END

# variables for specific HPC
HIP_VISIBLE_DEVICES="0,1,2,3,4,5,6,7"
export ROCR_VISIBLE_DEVICES=$SLURM_LOCALID
export LD_LIBRARY_PATH=$HIP_LIB_PATH:$LD_LIBRARY_PATH
export NCCL_SOCKET_IFNAME=hsn
export NCCL_NET_GDR_LEVEL=3
export MIOPEN_USER_DB_PATH=/tmp/${{USER}}-miopen-cache-${{SLURM_JOB_ID}}
export MIOPEN_CUSTOM_CACHE_DIR=${{MIOPEN_USER_DB_PATH}}
export CXI_FORK_SAFE=1
export CXI_FORK_SAFE_HP=1
export FI_CXI_DISABLE_CQ_HUGETLB=1
export HCC_AMDGPU_TARGET=gfx90a
export HIP_LAUNCH_BLOCKING=1
export NCCL_ASYNC_ERROR_HANDLING=1
export NCCL_IB_TIMEOUT=50
export UCX_RC_TIMEOUT=4s
export NCCL_IB_RETRY_CNT=10

source your/env_path/bin/activate

#HeAT NCCL setup
srun --cpu-bind=none python3 -u %executable%
