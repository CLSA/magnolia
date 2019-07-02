<?php
/**
 * stage.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * stage: record
 */
class stage extends \cenozo\database\record
{
  /**
   * Determines whether the stage is complete and may proceed to the next stage-type
   */
  public function check_if_complete()
  {
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    $db_stage_type = $this->get_stage_type();
    $review_list = $this->get_review_object_list();

    if( 'DSAC Selection' == $db_stage_type->name )
    {
      // DSAC selection need only choose reviewers, not have the reviews completed yet
      foreach( $review_list as $db_review )
        if( is_null( $db_review->user_id ) )
          return 'Both reviewers must be selected before proceeding to the next stage.';
    }
    else if( 'Decision Made' == $db_stage_type->name )
    {
      // the reqn's decision_notice must be set in order for the decision made stage to be complete
      if( is_null( $this->get_reqn()->decision_notice ) )
        return 'The decision notice must be set before proceeding to the next stage.';
    }
    else if( 'Agreement' == $db_stage_type->name )
    {
      // make sure both the agreement and ethics files have been attached
      $db_reqn = $this->get_reqn();
      $db_reqn_version = $db_reqn->get_current_reqn_version();
      if( is_null( $db_reqn_version->ethics_filename ) )
        return 'The ethics letter must be attached before proceeding to the next stage.';
      if( is_null( $db_reqn_version->agreement_filename ) )
        return 'The agreement letter must be attached before proceeding to the next stage.';
    }
    else
    {
      // DSAC review needs to use the list of reviews from the DSAC selection stage
      if( 'DSAC Review' == $db_stage_type->name )
      {
        // make sure that all DSAC Selection reviews are complete
        $db_dsac_selection_stage_type = $stage_type_class_name::get_unique_record( 'name', 'DSAC Selection' );
        $review_list = array_merge( $review_list, $db_dsac_selection_stage_type->get_review_object_list( $this->reqn_id ) );
      }

      // make sure all reviews associated with this stage are complete
      foreach( $review_list as $db_review )
      {
        if( is_null( $db_review->recommendation_type_id ) )
        {
          return sprintf(
            'The recommendation for the %s Review%s must be chosen before proceeding to the next stage.',
            $db_review->get_review_type()->name,
            '.' == $db_review->amendment ? '' : sprintf( ' (Amendment %s)', $db_review->amendment )
          );
        }
      }
    }

    return true;
  }

  /**
   * Convenience method for getting this stage's review list as objects
   */
  public function get_review_object_list()
  {
    return $this->get_stage_type()->get_review_object_list( $this->reqn_id );
  }
}
