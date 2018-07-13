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
   * TODO: document
   */
  public function check_if_complete()
  {
    $db_stage_type = $this->get_stage_type();
    $review_list = $this->get_review_list();

    // DSAC selection need only choose reviewers, not have the reviews completed yet
    if( 'DSAC Selection' == $db_stage_type->name )
    {
      foreach( $review_list as $db_review )
        if( is_null( $db_review->user_id ) )
          return 'Both reviewers must be selected before proceeding to the next stage.';
    }
    else
    {
      // DSAC review needs to use the list of reviews from the DSAC selection stage
      if( 'DSAC Review' == $db_stage_type->name )
      {
        // make sure that all DSAC Selection reviews are complete
        $db_dsac_selection_stage_type = $stage_type_class_name::get_unique_record( 'name', 'DSAC Selection' );
        $review_list = $db_dsac_selection_stage_type->get_review_list( $this->reqn_id );
      }

      // make sure all reviews associated with this stage are complete
      foreach( $review_list as $db_review )
      {
        if( is_null( $db_review->recommendation ) )
        {
          return sprintf(
            'The %s Review\'s recommendation must be chosen before proceeding to the next stage.',
            $db_review->get_review_type()->name
          );
        }
      }
    }

    return true;
  }

  /**
   * TODO: document
   */
  public function get_review_list()
  {
    return $this->get_stage_type()->get_review_list( $this->reqn_id );
  }
}
