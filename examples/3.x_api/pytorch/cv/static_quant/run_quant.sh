#!/bin/bash
set -x

function main {

  init_params "$@"
  run_tuning

}

# init params
function init_params {
  batch_size=16
  tuned_checkpoint="saved_results"
  for var in "$@"
  do
    case $var in
      --topology=*)
          topology=$(echo $var |cut -f2 -d=)
      ;;
      --dataset_location=*)
          dataset_location=$(echo $var |cut -f2 -d=)
      ;;
      --input_model=*)
          input_model=$(echo $var |cut -f2 -d=)
      ;;
      --batch_size=*)
          batch_size=$(echo $var |cut -f2 -d=)
      ;;
       --output_model=*)
           tuned_checkpoint=$(echo $var |cut -f2 -d=)
       ;;
      *)
          echo "Error: No such parameter: ${var}"
          exit 1
      ;;
    esac
  done

}

# run_tuning
function run_tuning {
    if [ "${topology}" = "resnet18_pt2e_static" ]; then
        model_name_or_path="resnet18"
    fi
    python main.py \
            --pretrained \
            -t \
            -a resnet18 \
            -b ${batch_size} \
            --tuned_checkpoint ${tuned_checkpoint} \
            ${dataset_location}
}

main "$@"
