<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new reqn
    $is_new = is_null( $this->id );

    // make sure the deadline is appropriate
    $this->assert_deadline();

    parent::save();

    // if we're changing the ethics_filename to null then delete the ethics_letter file
    if( is_null( $this->ethics_filename ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is a new reqn then assign it to the first stage
    if( $is_new ) $this->add_to_stage( 1 );
  }

  /**
   * Check the reqn's deadline and change it to the next available deadline if needed
   * NOTE: This method will change the deadline_id column but not save the record
   * @access public
   */
  public function assert_deadline()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );

    $db_deadline = NULL;
    $change_deadline = false;
    if( is_null( $this->deadline_id ) )
    { // no deadline found
      $db_deadline = $deadline_class_name::get_next();
      $change_deadline = true;
    }
    else
    {
      $rank = $this->get_current_rank();
      if( is_null( $rank ) || 1 == $rank )
      {
        if( 0 < $this->get_deadline()->date->diff( util::get_datetime_object() )->days )
        { // deadline has expired, get the next one
          $db_deadline = $deadline_class_name::get_next();
          $change_deadline = true;
        }
      }
    }

    if( $change_deadline )
    {
      if( is_null( $db_deadline ) )
        throw lib::create( 'exception\runtime',
          'Cannot proceed since there are no future deadlines defined.',
          __METHOD__ );
      $this->deadline_id = $db_deadline->id;
    }
  }

  /**
   * Returns the reqns last stage
   * @return database\stage
   * @access public
   */
  public function get_last_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_column( 'stage_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Returns the reqns last stage's stage type
   * @return database\stage_type
   * @access public
   */
  public function get_last_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_table_column( 'stage', 'stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->left_join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
    $modifier->where( 'reqn_last_stage.reqn_id', '=', $this->id );

    $stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_type_id ? lib::create( 'database\stage_type', $stage_type_id ) : NULL;
  }

  /**
   * Returns the reqn's current stage type rank
   * @param integer $rank
   * @return boolean (may be NULL if the reqn has no rank)
   * @access public
   */
  public function get_current_rank()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'reqn_last_stage' );
    $select->add_table_column( 'stage_type', 'rank' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->left_join( 'stage', 'reqn_last_stage.stage_id', 'stage.id' );
    $modifier->left_join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );
    $modifier->where( 'reqn_last_stage.reqn_id', '=', $this->id );

    return static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * Adds the reqn to a stage
   * 
   * The stage type may either be a stage_type object, the name of a stage_type, the rank of a
   * stage_type or NULL.  NULL should only be used when the current stage_type only has one "next"
   * stage_type, otherwise an exception will be thrown.
   * @param mixed $stage_type A rank, name or stage_type record
   * @param boolean $unprepared Whether the stage must be prepared (set to NULL for the stage_type's default)
   * @access public
   */
  public function add_to_stage( $stage_type = NULL, $unprepared = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $review_class_name = lib::get_class_name( 'database\review' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();
    $db_last_stage = $this->get_last_stage();
    $db_last_stage_type = $db_last_stage->get_stage_type();

    // get the next stage_type
    $next_stage_type_list = is_null( $db_last_stage_type )
                          ? array()
                          : $db_last_stage_type->get_next_stage_type_list();

    $db_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      if( 1 < count( $next_stage_type_list ) )
        throw lib::create( 'exception\runtime',
          'Cannot add next default stage as more than one stage type is possible.', __METHOD__ );
      $db_stage_type = current( $next_stage_type_list );
    }
    else if( util::string_matches_int( $stage_type ) )
    {
      $db_stage_type = $stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_stage_type = $stage_type_class_name::get_unique_record( 'name', $stage_type );
    }
    else if( is_a( $db_stage_type, lib::get_class_name( 'database\stage_type' ) ) )
    {
      $db_stage_type = $stage_type;
    }

    if( is_null( $db_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    // make sure the stage type is appropriate
    if( is_null( $db_last_stage_type ) )
    {
      // we can only add the first stage when the reqn currently has no stages
      if( 1 != $db_stage_type->rank )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but reqn has no existing stage.', $db_stage_type->name ),
          __METHOD__ );
    }
    else
    {
      // determine whether we can safely proceed to the next stage
      $notice = false;
      if( 'Admin Review' == $db_last_stage_type->name )
      {
        // make sure the admin review is done
        $db_review = $review_class_name::get_unique_record( array( 'reqn_id', 'type' ), array( $this->id, 'Admin' ) );
        if( is_null( $db_review ) || !$db_review->description )
          $notice = 'The Admin review must be completed before proceeding to the next stage.';
      }
      else if( 'SAC Review' == $db_last_stage_type->name )
      {
        // make sure the SAC review is done
        $db_review = $review_class_name::get_unique_record( array( 'reqn_id', 'type' ), array( $this->id, 'SAC' ) );
        if( is_null( $db_review ) || !$db_review->description )
          $notice = 'The SAC review must be completed before proceeding to the next stage.';
      }
      else if( 'DSAC Selection' == $db_last_stage_type->name )
      {
        // make sure at least 2 reviewers have been selected
        if( 2 > $this->get_dsac_review_count() )
          $notice = 'At least 2 reviewers must be selected before proceeding to the next stage.';
      }
      else if( 'DSAC Review' == $db_last_stage_type->name )
      {
        // make sure all DSAC reviews have been completed
        $modifier = lib::create( 'database\modifier' );
        $modifier->where( 'recommendation', '=', NULL );
        if( 0 < $this->get_dsac_review_count( $modifier ) )
        {
          $notice = 'All DSAC reviews must be completed before proceeding to the next stage.';
        }
        else
        {
          // make sure all DSAC reviews have been approved
          $modifier = lib::create( 'database\modifier' );
          $modifier->where( 'recommendation', '!=', 'Approved' );
          if( 0 < $this->get_dsac_review_count( $modifier ) )
            $notice = 'The requisition cannot proceed to the next stage because it has not been approved by all DSAC reviewers.';
        }
      }
      else if( 'SMT Review' == $db_last_stage_type->name )
      {
        // TODO
      }

      if( $notice ) throw lib::create( 'exception\notice', $notice, __METHOD__ );

      // determine which is the next stage type
      $found = false;
      foreach( $next_stage_type_list as $db_next_stage_type )
      {
        if( $db_stage_type->id == $db_next_stage_type->id )
        {
          $found = true;
          break;
        }
      }

      if( !$found )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" which does not come after current stage "%s".',
                   $db_stage_type->name,
                   $db_last_stage_type->name ),
          __METHOD__ );
    }


    // save the user who completed the current last stage
    $db_last_stage->user_id = $db_user->id;
    $db_last_stage->save();

    // create the new stage
    $db_stage = lib::create( 'database\stage' );
    $db_stage->reqn_id = $this->id;
    $db_stage->stage_type_id = $db_stage_type->id;
    $db_stage->datetime = util::get_datetime_object();
    $db_stage->unprepared = is_null( $unprepared ) ? $db_stage_type->preparation_required : $unprepared;
    $db_stage->save();

    // if we have just entered the admin review stage then set the identifier
    if( 'Admin Review' == $db_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();
    }
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @access public
   */
  public function generate_pdf_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );

    // get the data application
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Data Application PDF form.', __METHOD__ );

    $language = $this->get_language()->code;
    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.%s.pdf', PDF_FORM_PATH, $db_pdf_form->id, $language ) );

    $data = array( 'identifier' => $this->identifier );

    if( !is_null( $this->applicant_name ) ) $data['applicant_name'] = $this->applicant_name;
    if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
    if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
    if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
    if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
    if( !is_null( $this->applicant_email ) ) $data['applicant_email'] = $this->applicant_email;
    if( !is_null( $this->graduate_name ) ) $data['graduate_name'] = $this->graduate_name;
    if( !is_null( $this->graduate_program ) ) $data['graduate_program'] = $this->graduate_program;
    if( !is_null( $this->graduate_institution ) ) $data['graduate_institution'] = $this->graduate_institution;
    if( !is_null( $this->graduate_address ) ) $data['graduate_address'] = $this->graduate_address;
    if( !is_null( $this->graduate_phone ) ) $data['graduate_phone'] = $this->graduate_phone;
    if( !is_null( $this->graduate_email ) ) $data['graduate_email'] = $this->graduate_email;
    if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
    if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
    if( !is_null( $this->title ) ) $data['title'] = $this->title;
    if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
    if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
    $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
    if( !is_null( $this->background ) ) $data['background'] = $this->background;
    if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
    if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
    if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

    if( !is_null( $this->funding ) )
    {
      if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
      else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
      else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
    }
    if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
    if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
    if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics ? 'yes' : 'no';
    if( !is_null( $this->ethics_date ) ) $data['ethics_date'] = $this->ethics_date->format( 'Y-m-d' );
    if( !is_null( $this->ethics_filename ) ) $data['ethics_filename'] = $this->ethics_filename;
    if( !is_null( $this->waiver ) )
    {
      if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
      else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
    }
    if( !is_null( $this->applicant_name ) ) $data['signature_applicant_name'] = $this->applicant_name;

    foreach( $this->get_coapplicant_list() as $index => $coapplicant )
    {
      $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
      $data[sprintf( 'coapplicant%d_position', $index+1 )] =
        sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
      $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
      $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
    }

    $reference_list = array();
    $reference_sel = lib::create( 'database\select' );
    $reference_sel->add_column( 'reference' );
    $reference_mod = lib::create( 'database\modifier' );
    $reference_mod->order( 'rank' );
    foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $index => $reference )
      $reference_list[] = $reference['reference'];
    $data['references'] = implode( "\n", $reference_list );

    $pdf_writer->fill_form( $data );
    $filename = sprintf( '%s/%s.pdf', REQN_PATH, $this->id );
    if( !$pdf_writer->save( $filename ) ) 
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $this->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }
}
